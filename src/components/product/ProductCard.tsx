'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCart } from '@/lib/cart/CartContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ShoppingCart, Eye, Sparkles, Check, Info } from 'lucide-react';

interface IProductData {
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
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  wholesaleMinQty?: number;
}

export default function ProductCard({ product }: { product: IProductData }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { t, language } = useTranslation();

  const [added, setAdded] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // 1. Determine Dynamic Pricing
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

  // 2. Determine Stock Status
  let stockBadge = (
    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
      {t('cartInventoryStock')}
    </span>
  );
  let isOutOfStock = false;

  if (product.stock <= 0) {
    isOutOfStock = true;
    stockBadge = (
      <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
        {t('cartInventoryOut')}
      </span>
    );
  } else if (product.stock <= product.lowStockThreshold) {
    stockBadge = (
      <span className="bg-amber-50 text-amber-700 border border-amber-250 text-[10px] font-bold px-2 py-0.5 rounded-full">
        {t('cartInventoryLow')} ({product.stock})
      </span>
    );
  }

  // 3. Handle Add to Cart action
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    addToCart(product._id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
    <>
      <div className="group bg-white rounded-xl shadow-xs hover:shadow-md border border-gray-150 overflow-hidden flex flex-col h-full relative transition-all duration-200">
        
        {/* Top Feature Badges (e.g. sale, featured) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isFeatured && (
            <span className="bg-[#1A2A4A] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              Featured
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#E53935] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Product Image Panel */}
        <Link href={`/product/${product.slug}`} className="relative h-36 sm:h-56 w-full block bg-gray-50 overflow-hidden border-b border-gray-100">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-103"
            style={{
              backgroundImage: `url('${product.images[0] || '/images/hero_banner.png'}')`,
            }}
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          {/* Quick View Button overlay on hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setQuickViewOpen(true);
            }}
            className="absolute bottom-3 right-3 p-2 bg-white hover:bg-[#1A2A4A] text-[#1A2A4A] hover:text-white rounded-full shadow-md translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250 z-10"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </Link>

        {/* Content Info */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-1">
              <span className="hidden sm:block text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SKU: {product.sku}
              </span>
              <span className="sm:hidden text-[10px] text-gray-400 font-bold uppercase tracking-wider">&nbsp;</span>
              {stockBadge}
            </div>
            <Link href={`/product/${product.slug}`} className="block">
              <h3 className="font-bold text-[#101A2D] hover:text-[#E53935] text-sm sm:text-base leading-snug line-clamp-2 transition-colors">
                {product.name}
              </h3>
            </Link>
            {product.shortDescription && (
              <p className="text-xs text-gray-500 line-clamp-1">
                {product.shortDescription}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {/* Price display & Roles indicators */}
            <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
              <span className="text-sm sm:text-lg font-black text-[#1A2A4A]">{formattedPrice}</span>
              {formattedCrossedPrice && (
                <span className="text-xs text-gray-400 line-through font-semibold">
                  {formattedCrossedPrice}
                </span>
              )}
              {priceBadge && (
                <span className="flex items-center gap-0.5 bg-red-50 text-[#E53935] text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm border border-red-100 uppercase tracking-wide">
                  <Sparkles className="w-2.5 h-2.5" />
                  {priceBadge}
                </span>
              )}
            </div>

            {/* Actions Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-150 ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : added
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[#1A2A4A] hover:bg-[#101A2D] text-white shadow-sm active:scale-98'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 animate-scale-in" />
                  <span className="hidden sm:inline">{t('cartAdded')}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">{isOutOfStock ? t('cartInventoryOut') : t('cartAdd')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. QUICK VIEW MODAL DRAWER */}
      {quickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setQuickViewOpen(false)}
          />
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl relative overflow-hidden animate-scale-in flex flex-col md:flex-row z-10 max-h-[90vh]">
            
            {/* Left Image Column */}
            <div className="relative h-64 md:h-auto md:w-1/2 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-150">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${product.images[0] || '/images/hero_banner.png'}')`,
                }}
              />
              <button
                onClick={() => setQuickViewOpen(false)}
                className="absolute top-4 left-4 p-2 bg-white/80 hover:bg-white text-black rounded-full shadow-md md:hidden"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Right Details Column */}
            <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-gray-400 font-bold tracking-wider">SKU: {product.sku}</span>
                  {stockBadge}
                </div>
                <h2 className="text-xl font-bold text-[#101A2D]">{product.name}</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#1A2A4A]">{formattedPrice}</span>
                  {formattedCrossedPrice && (
                    <span className="text-sm text-gray-400 line-through">{formattedCrossedPrice}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed max-h-36 overflow-y-auto pr-1">
                  {product.description}
                </p>
                {product.wholesaleMinQty && product.wholesaleMinQty > 1 && user?.customerType === 'WHOLESALE' && (
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 bg-gray-50 p-1.5 rounded-md border border-gray-150">
                    <Info className="w-3.5 h-3.5 text-[#1A2A4A]" />
                    <span>Minimum bulk order quantity required: {product.wholesaleMinQty} units.</span>
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                    isOutOfStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-250'
                      : added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#1A2A4A] hover:bg-[#101A2D] text-white shadow-sm'
                  }`}
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  <span>{added ? t('cartAdded') : t('cartAdd')}</span>
                </button>
                <button
                  onClick={() => setQuickViewOpen(false)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-[#333333] rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                >
                  ✕ {language === 'ta' ? 'மூடு' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
