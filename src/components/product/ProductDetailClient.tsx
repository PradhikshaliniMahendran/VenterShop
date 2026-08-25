'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCart } from '@/lib/cart/CartContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Sparkles,
  Plus,
  Minus,
  Info,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface IProductDetail {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  images: string[];
  retailPrice: number;
  communityPrice: number;
  wholesalePrice: number;
  stock: number;
  lowStockThreshold: number;
  wholesaleMinQty?: number;
  bulkPricing?: { minQty: number; discountPercent: number }[];
  categoryId: { _id: string; name: string; slug: string };
}

export default function ProductDetailClient({ product }: { product: IProductDetail }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { t, language } = useTranslation();
  const router = useRouter();

  const isWholesale = user?.customerType === 'WHOLESALE';
  const minQuantity = isWholesale && product.wholesaleMinQty ? product.wholesaleMinQty : 1;
  
  const [quantity, setQuantity] = useState(minQuantity);
  const [activeImage, setActiveImage] = useState(product.images[0] || '/images/hero_banner.png');
  const [added, setAdded] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  useEffect(() => {
    setQuantity(minQuantity);
  }, [minQuantity]);

  // Pricing Calculations
  let price = product.retailPrice;
  let crossedOutPrice: number | null = null;
  let priceBadge: string | null = null;

  if (user) {
    if (user.customerType === 'WHOLESALE') {
      price = product.wholesalePrice;
      priceBadge = language === 'ta' ? 'மொத்த விலை (B2B)' : 'Wholesale Price';
      if (product.retailPrice > product.wholesalePrice) {
        crossedOutPrice = product.retailPrice;
      }
    } else if (user.customerType === 'COMMUNITY') {
      price = product.communityPrice;
      priceBadge = language === 'ta' ? 'சமூக விலை' : 'Community Price';
      if (product.retailPrice > product.communityPrice) {
        crossedOutPrice = product.retailPrice;
      }
    }
  }

  // Stock Checks
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

  const handleQtyChange = (val: number) => {
    if (val < minQuantity) return;
    if (val > product.stock) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product._id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product._id, quantity);
    router.push('/checkout');
  };

  const handleToggleWishlist = () => {
    setWishlistAdded(!wishlistAdded);
  };

  const formattedPrice = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(price);

  const formattedCrossedPrice = crossedOutPrice
    ? new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
      }).format(crossedOutPrice)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* 1. BREADCRUMBS */}
      <nav className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-black transition-colors">
          {t('navHome')}
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black transition-colors">
          {t('navShop')}
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.categoryId.slug}`} className="hover:text-[#E53935] transition-colors">
          {product.categoryId.name}
        </Link>
        <span>/</span>
        <span className="text-gray-400 select-none truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. PRODUCT DETAIL HERO CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white p-4 sm:p-8 lg:p-10 rounded-3xl border border-gray-150 shadow-sm mb-10">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-[320px] sm:h-[450px] w-full rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 shadow-xs">
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-300 transform hover:scale-102"
              style={{ backgroundImage: `url('${activeImage}')` }}
            />
            {/* Stock alert overlay */}
            <div className="absolute top-4 right-4">
              {isOutOfStock ? (
                <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {t('cartInventoryOut')}
                </span>
              ) : isLowStock ? (
                <span className="bg-amber-50 text-amber-700 border border-amber-250 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {t('cartInventoryLow')}
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {t('cartInventoryStock')}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl bg-gray-50 overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img ? 'border-[#E53935] scale-98 shadow-xs' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-gray-100 text-[#101A2D] font-bold px-2.5 py-1 rounded-md">SKU: {product.sku}</span>
              <span className="text-gray-400 font-semibold">•</span>
              <span className="text-gray-500 font-bold uppercase">Category: {product.categoryId.name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#101A2D] tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Pricing Section */}
            <div className="border-y border-gray-100 py-3.5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-[#1A2A4A]">{formattedPrice}</span>
              {formattedCrossedPrice && (
                <span className="text-base sm:text-lg text-gray-400 line-through font-semibold">
                  {formattedCrossedPrice}
                </span>
              )}
              {priceBadge && (
                <span className="flex items-center gap-1 bg-red-50 text-[#E53935] text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-red-100 uppercase tracking-wide">
                  <Sparkles className="w-3 h-3" />
                  {priceBadge}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {product.shortDescription || product.description.substring(0, 180) + '...'}
            </p>

            {/* B2B / Community Warnings */}
            {isWholesale && product.wholesaleMinQty && product.wholesaleMinQty > 1 && (
              <div className="flex items-start gap-2 bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-normal">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold">B2B Order Constraints:</span> Minimum order quantity of <strong className="text-[#E53935]">{product.wholesaleMinQty} units</strong> required for wholesale pricing.
                </div>
              </div>
            )}

            {/* Wholesale bulk pricing table */}
            {isWholesale && product.bulkPricing && product.bulkPricing.length > 0 && (
              <div className="bg-emerald-50/60 border border-emerald-250 rounded-xl p-3.5 text-xs">
                <p className="font-extrabold text-emerald-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Wholesale Bulk Savings Matrix
                </p>
                <div className="grid grid-cols-2 gap-2 text-emerald-700 font-semibold text-[11px]">
                  {product.bulkPricing.map((tier, idx) => (
                    <div key={idx} className="flex justify-between border-b border-emerald-100 pb-1">
                      <span>Buy {tier.minQty}+ units:</span>
                      <span className="font-extrabold text-emerald-800">Save {tier.discountPercent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {language === 'ta' ? 'அளவு (Quantity):' : 'Quantity:'}
                </span>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white h-11 w-36 shadow-xs select-none">
                  <button
                    onClick={() => handleQtyChange(quantity - 1)}
                    disabled={quantity <= minQuantity}
                    className="w-11 h-full flex items-center justify-center text-gray-600 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-grow text-center text-sm font-black text-[#101A2D]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-11 h-full flex items-center justify-center text-gray-600 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Solid, High-Impact Action Buttons */}
            <div className="space-y-2.5">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 shadow-md ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    : added
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-[#1A2A4A] hover:bg-[#101A2D] text-white active:scale-[0.99]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 animate-scale-in" />
                    <span>{t('cartAdded')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>{isOutOfStock ? t('cartInventoryOut') : t('cartAdd')}</span>
                  </>
                )}
              </button>

              {/* Buy Now Button */}
              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#E53935] hover:bg-[#c62828] text-white shadow-lg shadow-red-500/25 flex items-center justify-center gap-2.5 active:scale-[0.99] transition-all"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>{t('cartBuyNow')}</span>
                </button>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={`w-full py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  wishlistAdded
                    ? 'bg-red-50 text-[#E53935] border-red-200'
                    : 'bg-white text-gray-700 border-gray-250 hover:bg-gray-50 hover:text-[#E53935]'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlistAdded ? 'fill-current text-[#E53935]' : ''}`} />
                <span>
                  {wishlistAdded
                    ? (language === 'ta' ? 'விருப்பப்பட்டியலில் சேர்க்கப்பட்டது ✓' : 'Added to Wishlist ✓')
                    : (language === 'ta' ? 'விருப்பப்பட்டியலில் சேர்' : 'Add to Wishlist')}
                </span>
              </button>
            </div>

            {/* Premium Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-500 font-bold">
              <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
                <Truck className="w-4 h-4 text-[#1A2A4A]" />
                <span>Canada-Wide Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
                <RotateCcw className="w-4 h-4 text-[#E53935]" />
                <span>Guaranteed Freshness</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABS: DESCRIPTION AND SPECIFICATIONS */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-xs overflow-hidden mb-12">
        {/* Tab Headers - 50/50 split on mobile */}
        <div className="flex border-b border-gray-150 bg-[#F5F5F5]">
          <button
            onClick={() => setActiveTab('desc')}
            className={`flex-1 text-center py-4 px-6 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors ${
              activeTab === 'desc'
                ? 'bg-white text-[#1a2a4a] border-b-2 border-b-[#E53935]'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {language === 'ta' ? 'விளக்கம்' : 'Description'}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 text-center py-4 px-6 text-xs sm:text-sm font-black uppercase tracking-wider border-l border-gray-200 transition-colors ${
              activeTab === 'specs'
                ? 'bg-white text-[#1a2a4a] border-b-2 border-b-[#E53935]'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {language === 'ta' ? 'விவரக்குறிப்புகள்' : 'Specifications'}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8">
          {activeTab === 'desc' ? (
            <div className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-line space-y-4">
              <p>{product.description}</p>
            </div>
          ) : (
            <div className="max-w-xl text-sm">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-[#101A2D] w-1/3">SKU</td>
                    <td className="py-3 text-gray-600 font-mono">{product.sku}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-[#101A2D]">Product Category</td>
                    <td className="py-3 text-gray-600">{product.categoryId.name}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-[#101A2D]">Packaging Unit</td>
                    <td className="py-3 text-gray-600">Standard retail packing</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-[#101A2D]">Fulfillment Market</td>
                    <td className="py-3 text-gray-600">Canada Nationwide Shipping</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-[#101A2D]">Safety Certification</td>
                    <td className="py-3 text-gray-600">Health Canada / CFIA Compliant</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
