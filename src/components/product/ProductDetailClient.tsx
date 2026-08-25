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

  // 1. Determine starting quantity based on user type & B2B minimum requirements
  const isWholesale = user?.customerType === 'WHOLESALE';
  const minQuantity = isWholesale && product.wholesaleMinQty ? product.wholesaleMinQty : 1;
  
  const [quantity, setQuantity] = useState(minQuantity);
  const [activeImage, setActiveImage] = useState(product.images[0] || '/images/hero_banner.png');
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  // Sync quantity state if user logs in later
  useEffect(() => {
    setQuantity(minQuantity);
  }, [minQuantity]);

  // 2. Pricing Calculations
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

  // 3. Stock Checks
  let isOutOfStock = product.stock <= 0;
  let isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. BREADCRUMBS */}
      <nav className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 flex gap-2">
        <Link href="/" className="hover:text-black">
          {t('navHome')}
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black">
          {t('navShop')}
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.categoryId.slug}`} className="hover:text-[#E53935]">
          {product.categoryId.name}
        </Link>
        <span>/</span>
        <span className="text-gray-400 select-none truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. PRODUCT DETAIL HERO BOX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-2xl border border-gray-150 shadow-xs mb-10">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-[350px] sm:h-[450px] w-full rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-300"
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
              ) : null}
            </div>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-lg bg-gray-50 overflow-hidden border-2 shrink-0 transition-all ${
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
              <span className="bg-gray-100 text-[#101A2D] font-bold px-2 py-0.5 rounded-sm">SKU: {product.sku}</span>
              <span className="text-gray-400 font-semibold">•</span>
              <span className="text-gray-500 font-bold uppercase">Category: {product.categoryId.name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#101A2D] tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Pricing Section */}
            <div className="border-y border-gray-100 py-3 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black text-[#1A2A4A]">{formattedPrice}</span>
              {formattedCrossedPrice && (
                <span className="text-base text-gray-400 line-through font-semibold">
                  {formattedCrossedPrice}
                </span>
              )}
              {priceBadge && (
                <span className="flex items-center gap-1 bg-red-50 text-[#E53935] text-[10px] font-extrabold px-2.5 py-1 rounded-sm border border-red-100 uppercase tracking-wide">
                  <Sparkles className="w-3 h-3" />
                  {priceBadge}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              {product.shortDescription || product.description.substring(0, 180) + '...'}
            </p>

            {/* B2B / Community Warnings */}
            {isWholesale && product.wholesaleMinQty && product.wholesaleMinQty > 1 && (
              <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-500 leading-normal">
                <Info className="w-4 h-4 text-[#1A2A4A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-[#101A2D]">B2B Order Constraints:</span> This product requires a minimum order quantity of <strong className="text-[#E53935]">{product.wholesaleMinQty} units</strong> for wholesale tier pricing.
                </div>
              </div>
            )}

            {/* Wholesale bulk pricing table grid */}
            {isWholesale && product.bulkPricing && product.bulkPricing.length > 0 && (
              <div className="bg-emerald-50/50 border border-emerald-250 rounded-lg p-3 text-xs">
                <p className="font-extrabold text-emerald-800 mb-1.5 flex items-center gap-1">
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
            {/* Quantity and Cart Controls */}
            {!isOutOfStock && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider sm:w-20">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 h-10 w-36 shadow-xs select-none">
                  <button
                    onClick={() => handleQtyChange(quantity - 1)}
                    disabled={quantity <= minQuantity}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-grow text-center text-sm font-extrabold text-[#101A2D]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {product.stock <= 10 && (
                  <span className="text-xs font-semibold text-amber-600">
                    Only {product.stock} units left in stock!
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-md ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1A2A4A] hover:bg-[#101A2D] text-white active:scale-98'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 animate-scale-in" />
                    <span>{t('cartAdded')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isOutOfStock ? t('cartInventoryOut') : t('cartAdd')}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#E53935] hover:bg-[#c62828] text-white shadow-md hover:shadow-lg active:scale-98 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              >
                <span>{t('cartBuyNow')}</span>
              </button>

              <button
                className="h-12 px-4 flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-[#E53935] rounded-xl transition-colors shrink-0"
                title="Add to Wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="sm:hidden text-xs font-bold uppercase tracking-wider">Wishlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABS: DESCRIPTION AND SPECIFICATIONS */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden mb-10">
        {/* Tab Headers - 50/50 split on mobile */}
        <div className="flex border-b border-gray-150 bg-[#F5F5F5]">
          <button
            onClick={() => setActiveTab('desc')}
            className={`flex-1 text-center py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'desc'
                ? 'bg-white text-[#1a2a4a] border-b-2 border-b-[#E53935]'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {language === 'ta' ? 'விளக்கம்' : 'Description'}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 text-center py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-l border-gray-200 transition-colors ${
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
                    <td className="py-2.5 font-bold text-[#101A2D] w-1/3">SKU</td>
                    <td className="py-2.5 text-gray-600">{product.sku}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-bold text-[#101A2D]">Product Category</td>
                    <td className="py-2.5 text-gray-600">{product.categoryId.name}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-bold text-[#101A2D]">Packaging Unit</td>
                    <td className="py-2.5 text-gray-600">Standard retail packing</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-bold text-[#101A2D]">Fulfillment Market</td>
                    <td className="py-2.5 text-gray-600">Canada Nationwide Shipping</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-[#101A2D]">Safety Certification</td>
                    <td className="py-2.5 text-gray-600">Health Canada / CFIA Compliant</td>
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
