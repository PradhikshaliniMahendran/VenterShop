'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { ShoppingCart, Flame, ArrowRight, Star } from 'lucide-react';

interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  retailPrice: number;
  communityPrice: number;
  wholesalePrice: number;
  stock: number;
}

export default function FeaturedDeals() {
  const { t, language } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/products?limit=3');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error('Failed to load featured products:', e);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, prodId: string) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prodId, 1);
  };

  if (loading) {
    return (
      <section className="py-24 bg-[#FAF7F2] text-xs font-semibold">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="h-6 w-32 bg-gray-205 rounded animate-pulse mx-auto" />
          <div className="h-10 w-64 bg-gray-205 rounded animate-pulse mx-auto" />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 pt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-white rounded-3xl border border-gray-150 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-[#FAF7F2] text-[#1A2A4A] relative z-10 border-y border-gray-250/60 text-xs font-semibold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-300 pb-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-black tracking-[0.25em] text-[#E53935] inline-flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#E53935] animate-bounce" />
              {language === 'ta' ? 'இன்றைய சிறப்பு சலுகைகள்' : "TODAY'S SPECIAL OFFERS"}
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-extrabold text-[#1A2A4A] mt-1">
              {language === 'ta' ? 'பிரத்தியேக சலுகைகள்' : 'Exclusive Daily Deals'}
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1A2A4A] hover:text-[#E53935] transition-colors"
          >
            <span>{language === 'ta' ? 'அனைத்து தயாரிப்புகளும்' : 'VIEW ALL PRODUCTS'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid - 2 per row on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {products.map((prod) => {
            const retailPrice = prod.retailPrice || 0;
            const communityPrice = prod.communityPrice || 0;
            const wholesalePrice = prod.wholesalePrice || 0;

            return (
              <Link
                key={prod._id}
                href={`/product/${prod.slug}`}
                className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                {/* Product Image */}
                <div
                  className="h-36 sm:h-56 bg-cover bg-center bg-gray-50 border-b border-gray-100 transition-transform duration-500 group-hover:scale-101"
                  style={{ backgroundImage: `url('${prod.images[0] || '/images/hero_banner.png'}')` }}
                />

                {/* Card body */}
                <div className="p-3 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                  <div className="space-y-1">
                    {/* Stars */}
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                      ))}
                    </div>
                    {/* Title */}
                    <h3 className="text-base font-extrabold text-[#101A2D] group-hover:text-[#E53935] transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {prod.description || 'Premium quality product sourced for Canadian families.'}
                    </p>
                  </div>

                  {/* Multi-Segment Pricing Information */}
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-200/50 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
                      <span>Retail Price:</span>
                      <span className="text-[#101A2D] font-extrabold text-xs">${retailPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-emerald-700 font-extrabold uppercase">
                      <span>Community Group:</span>
                      <span>${communityPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#E53935] font-extrabold uppercase">
                      <span>B2B Wholesale:</span>
                      <span>${wholesalePrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Add to Cart triggers */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="space-y-0.5">
                      <span className="text-xs text-gray-400 font-medium">Retail Customer</span>
                      <p className="text-base font-black text-[#101A2D]">${retailPrice.toFixed(2)}</p>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, prod._id)}
                      disabled={prod.stock === 0}
                      className="p-2.5 rounded-full bg-[#1A2A4A] hover:bg-[#E53935] text-white transition-all shadow-sm flex items-center justify-center"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
