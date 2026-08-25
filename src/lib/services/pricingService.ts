import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Product, { IProduct } from '@/models/Product';
import Offer, { IOffer } from '@/models/Offer';
import Setting from '@/models/Setting';
import mongoose from 'mongoose';

export interface ICartItemInput {
  productId: string;
  quantity: number;
}

export interface IItemPricingBreakdown {
  productId: string;
  name: string;
  sku: string;
  image: string;
  basePrice: number; // Customer role base price
  finalPrice: number; // Unit price after item-level offers
  quantity: number;
  subtotal: number; // basePrice * quantity
  discount: number; // (basePrice - finalPrice) * quantity
  total: number; // finalPrice * quantity
  appliedOfferName?: string;
}

export interface ICartPricingBreakdown {
  items: IItemPricingBreakdown[];
  subtotal: number; // Sum of items' base subtotals
  itemDiscounts: number; // Sum of items' offer discounts
  deliveryFee: number;
  freeDeliveryThreshold: number;
  total: number; // subtotal - itemDiscounts + deliveryFee
}

/**
 * Pricing Engine Service
 */
export class PricingService {
  /**
   * Calculates the pricing breakdown for a list of cart items and customer profile
   */
  static async calculateCart(
    cartItems: ICartItemInput[],
    customerType: 'NORMAL' | 'COMMUNITY' | 'WHOLESALE' = 'NORMAL',
    communityId: string | null = null
  ): Promise<ICartPricingBreakdown> {
    await connectToDatabase();

    // 1. Fetch products safely
    const productIds = cartItems
      .filter((item) => item.productId && mongoose.Types.ObjectId.isValid(item.productId))
      .map((item) => new mongoose.Types.ObjectId(item.productId));
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    // Create a product map for fast lookup
    const productMap = new Map<string, IProduct>();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    // 2. Fetch active auto-applied offers (no voucher required)
    const now = new Date();
    const activeOffers = await Offer.find({
      isActive: true,
      voucherRequired: false,
      startDate: { $lte: now },
      endDate: { $gte: now },
      customerTypes: customerType,
    });

    const parsedItemsBreakdown: IItemPricingBreakdown[] = [];
    let cartSubtotal = 0;
    let cartItemDiscounts = 0;

    // 3. Process each item
    for (const cartItem of cartItems) {
      const product = productMap.get(cartItem.productId);
      if (!product) continue; // Skip if product doesn't exist or is inactive

      const qty = cartItem.quantity;

      // Determine customer type base price
      let basePrice = product.retailPrice;
      if (customerType === 'WHOLESALE') {
        basePrice = product.wholesalePrice;

        // Apply bulk pricing tier discounts if eligible
        if (product.bulkPricing && product.bulkPricing.length > 0) {
          let highestTierDiscount = 0;
          for (const tier of product.bulkPricing) {
            if (qty >= tier.minQty && tier.discountPercent > highestTierDiscount) {
              highestTierDiscount = tier.discountPercent;
            }
          }
          if (highestTierDiscount > 0) {
            basePrice = basePrice * (1 - highestTierDiscount / 100);
          }
        }
      } else if (customerType === 'COMMUNITY') {
        basePrice = product.communityPrice;
      }

      // Evaluate active offers applying to this product/category
      let bestDiscountAmount = 0;
      let appliedOfferName: string | undefined;

      const matchingOffers = activeOffers.filter((offer) => {
        // Check community constraint
        if (offer.communityIds && offer.communityIds.length > 0) {
          if (!communityId || !offer.communityIds.some((id) => id.toString() === communityId)) {
            return false;
          }
        }
        // Check product constraint
        const hasProducts = offer.productIds && offer.productIds.length > 0;
        const matchesProduct = hasProducts && offer.productIds.some((id) => id.toString() === product._id.toString());

        // Check category constraint
        const hasCategories = offer.categoryIds && offer.categoryIds.length > 0;
        const matchesCategory =
          hasCategories && offer.categoryIds.some((id) => id.toString() === product.categoryId.toString());

        // If specific products or categories are defined, it must match them
        if (hasProducts || hasCategories) {
          return matchesProduct || matchesCategory;
        }

        // Generic offer (applies to all products)
        return true;
      });

      // Find the offer yielding the maximum discount
      for (const offer of matchingOffers) {
        let discount = 0;
        if (offer.discountType === 'PERCENTAGE') {
          discount = basePrice * (offer.discountValue / 100);
          if (offer.maximumDiscount && discount > offer.maximumDiscount) {
            discount = offer.maximumDiscount;
          }
        } else if (offer.discountType === 'FIXED') {
          discount = offer.discountValue;
        }

        // Ensure we don't discount past the base price
        discount = Math.min(discount, basePrice);

        if (discount > bestDiscountAmount) {
          bestDiscountAmount = discount;
          appliedOfferName = offer.name;
        }
      }

      const finalPrice = Math.max(0, basePrice - bestDiscountAmount);
      const subtotal = basePrice * qty;
      const discount = (basePrice - finalPrice) * qty;
      const total = finalPrice * qty;

      cartSubtotal += subtotal;
      cartItemDiscounts += discount;

      parsedItemsBreakdown.push({
        productId: product._id.toString(),
        name: product.name,
        sku: product.sku,
        image: product.images[0] || '',
        basePrice,
        finalPrice,
        quantity: qty,
        subtotal,
        discount,
        total,
        appliedOfferName,
      });
    }

    // 4. Fetch delivery thresholds
    const settings = await Setting.findOne();
    const freeDeliveryThreshold = settings?.freeDeliveryThreshold ?? 75;
    const defaultDeliveryFee = 12.5; // Standard Canadian delivery fee

    const cartTotalAfterOffers = cartSubtotal - cartItemDiscounts;
    const deliveryFee = cartTotalAfterOffers >= freeDeliveryThreshold ? 0 : defaultDeliveryFee;

    return {
      items: parsedItemsBreakdown,
      subtotal: Math.round(cartSubtotal * 100) / 100,
      itemDiscounts: Math.round(cartItemDiscounts * 100) / 100,
      deliveryFee: Math.round(deliveryFee * 100) / 100,
      freeDeliveryThreshold,
      total: Math.round((cartTotalAfterOffers + deliveryFee) * 100) / 100,
    };
  }
}
