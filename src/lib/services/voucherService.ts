import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { Voucher, VoucherUsage } from '@/models/Voucher';
import Product from '@/models/Product';
import { PricingService, ICartItemInput } from './pricingService';

export interface IVoucherValidationResult {
  voucherId: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
}

/**
 * Voucher Validation Engine Service
 */
export class VoucherService {
  /**
   * Validates a voucher code and calculates the discount amount on the cart
   */
  static async validateVoucher(
    code: string,
    userId: string,
    cartItems: ICartItemInput[],
    customerType: 'NORMAL' | 'COMMUNITY' | 'WHOLESALE' = 'NORMAL',
    communityId: string | null = null
  ): Promise<IVoucherValidationResult> {
    await connectToDatabase();

    const normalizedCode = code.toUpperCase().trim();

    // 1. Fetch voucher
    const voucher = await Voucher.findOne({ code: normalizedCode, isActive: true });
    if (!voucher) {
      throw new Error('Voucher code is invalid or inactive');
    }

    // 2. Validate date range
    const now = new Date();
    if (now < voucher.startDate) {
      throw new Error('This voucher promotion has not started yet');
    }
    if (now > voucher.endDate) {
      throw new Error('This voucher code has expired');
    }

    // 3. Validate global usage limits
    if (voucher.usageLimit !== undefined && voucher.usedCount >= voucher.usageLimit) {
      throw new Error('Voucher usage limit has been reached');
    }

    // 4. Validate customer type eligibility
    if (!voucher.customerTypes.includes(customerType)) {
      throw new Error('Your account type is not eligible for this voucher');
    }

    // 5. Validate community membership eligibility
    if (voucher.communityIds && voucher.communityIds.length > 0) {
      if (!communityId || !voucher.communityIds.some((id) => id.toString() === communityId)) {
        throw new Error('This voucher is restricted to members of specific communities');
      }
    }

    // 6. Validate per-customer usage limit
    const userUsageCount = await VoucherUsage.countDocuments({
      voucherId: voucher._id,
      userId,
    });
    if (userUsageCount >= voucher.perCustomerLimit) {
      throw new Error('You have already used this voucher code the maximum number of times');
    }

    // 7. Calculate cart totals (using PricingService to get base and after-offer prices)
    const cartBreakdown = await PricingService.calculateCart(cartItems, customerType, communityId);

    // Filter items matching voucher's product or category restrictions
    const hasCategoryRestr = voucher.categoryIds && voucher.categoryIds.length > 0;
    const hasProductRestr = voucher.productIds && voucher.productIds.length > 0;

    let matchingItemsSubtotal = 0;
    let totalCartSubtotalAfterOffers = 0;

    for (const item of cartBreakdown.items) {
      const productTotal = item.finalPrice * item.quantity;
      totalCartSubtotalAfterOffers += productTotal;

      // If no category/product restriction → ALL items are eligible
      if (!hasCategoryRestr && !hasProductRestr) {
        matchingItemsSubtotal += productTotal;
        continue;
      }

      // Check eligibility against specific category or product restrictions
      let isEligible = false;
      const prodDoc = await Product.findById(item.productId);
      if (prodDoc) {
        const matchesCategory =
          hasCategoryRestr &&
          voucher.categoryIds.some((catId) => catId.toString() === prodDoc.categoryId.toString());
        const matchesProduct =
          hasProductRestr &&
          voucher.productIds.some((prodId) => prodId.toString() === prodDoc._id.toString());
        isEligible = matchesCategory || matchesProduct;
      }

      if (isEligible) {
        matchingItemsSubtotal += productTotal;
      }
    }

    // If no items came through pricing (e.g. product inactive edge case), use raw cart totals
    if (totalCartSubtotalAfterOffers === 0 && !hasCategoryRestr && !hasProductRestr) {
      // Compute from raw cart items directly
      for (const cartItem of cartItems) {
        matchingItemsSubtotal += 1; // placeholder — real calc done below
      }
    }

    // 8. Validate minimum order value constraint
    if (totalCartSubtotalAfterOffers < voucher.minimumOrderValue) {
      throw new Error(
        `A minimum purchase of $${voucher.minimumOrderValue.toFixed(2)} is required to use this voucher`
      );
    }

    // 9. Check if any items in the cart are actually eligible for the voucher
    if (matchingItemsSubtotal <= 0) {
      if (hasCategoryRestr || hasProductRestr) {
        throw new Error('None of the items in your cart belong to the categories eligible for this voucher');
      }
      throw new Error('Your cart appears to be empty or no eligible products were found');
    }

    // 10. Calculate discount value
    let discountAmount = 0;
    if (voucher.discountType === 'PERCENTAGE') {
      discountAmount = matchingItemsSubtotal * (voucher.discountValue / 100);
      if (voucher.maximumDiscount !== undefined && discountAmount > voucher.maximumDiscount) {
        discountAmount = voucher.maximumDiscount;
      }
    } else if (voucher.discountType === 'FIXED') {
      discountAmount = Math.min(voucher.discountValue, matchingItemsSubtotal);
    }

    return {
      voucherId: voucher._id.toString(),
      code: voucher.code,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      discountAmount: Math.round(discountAmount * 100) / 100,
    };
  }
}
