'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCart } from '@/lib/cart/CartContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ShoppingCart, Eye, Sparkles, Check } from 'lucide-react';

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

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

export default function ProductCard({ product }: { product: IProductData }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { t, language } = useTranslation();

  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : FALLBACK_IMAGE
  );

  // 1. Determine Dynamic Pricing
  let price = product.retailPrice || 0;
  let crossedOutPrice: number | null = null;
  let priceBadge: string | null = null;

  if (user) {
    if (user.customerType === 'WHOLESALE') {
      price = product.wholesalePrice || product.retailPrice;
      priceBadge = language === 'ta' ? 'மொத்த விலை (B2B)' : 'Wholesale Price';
      if (product.retailPrice > product.wholesalePrice) {
        crossedOutPrice = product.retailPrice;
      }
    } else if (user.customerType === 'COMMUNITY') {
      price = product.communityPrice || product.retailPrice;
      priceBadge = language === 'ta' ? 'சமூக விலை' : 'Community Price';
      if (product.retailPrice > product.communityPrice) {
        crossedOutPrice = product.retailPrice;
      }
    }
  }

  // 2. Stock Checks
  const isOutOfStock = product.stock <= 0;

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
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#801414]/40 hover:shadow-lg overflow-hidden flex flex-col justify-between h-full relative transition-all duration-300 p-3.5">
      
      {/* Top Feature Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
        {product.isBestSeller && (
          <span className="bg-[#1B5E20] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
            Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-[#1B5E20] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
            New Arrival
          </span>
        )}
        {product.isFeatured && !product.isBestSeller && !product.isNewArrival && (
          <span className="bg-[#801414] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
            Popular
          </span>
        )}
      </div>

      {/* Product Image Box with Universal Auto-Fit Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative h-44 sm:h-52 w-full flex items-center justify-center bg-[#FAF9F6] rounded-xl overflow-hidden mb-3 group-hover:bg-[#F5F3ED] transition-colors p-2.5"
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="max-h-full max-w-full w-auto h-auto object-contain object-center transform group-hover:scale-106 transition-transform duration-300 drop-shadow-xs"
          loading="lazy"
        />
      </Link>

      {/* Content Info */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
            SKU: {product.sku}
          </span>
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-gray-900 hover:text-[#801414] text-xs sm:text-sm leading-snug line-clamp-2 transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.shortDescription && (
            <p className="text-[11px] text-gray-500 line-clamp-1 font-medium">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Pricing & Add to cart button */}
        <div className="pt-2 space-y-2.5">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-[#801414]">
              {formattedPrice}
            </span>
            {formattedCrossedPrice && (
              <span className="text-xs text-gray-400 line-through font-semibold">
                {formattedCrossedPrice}
              </span>
            )}
            {priceBadge && (
              <span className="inline-flex items-center gap-0.5 bg-red-50 text-[#801414] text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-red-100">
                <Sparkles className="w-2.5 h-2.5" />
                {priceBadge}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                : added
                ? 'bg-[#1B5E20] text-white'
                : 'border border-[#801414] text-[#801414] hover:bg-[#801414] hover:text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <span>Add to Cart</span>
                <ShoppingCart className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
