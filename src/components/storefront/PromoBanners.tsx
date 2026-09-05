'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Check, ArrowRight, ShoppingBasket, Award } from 'lucide-react';

export default function PromoBanners() {
  const { language } = useTranslation();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Groceries Promo Bar */}
          <div className="bg-[#EBF5EC] border border-[#C8E6C9] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center shrink-0">
                  <ShoppingBasket className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#1B5E20] leading-tight">
                  GROCERIES – Fresh, Quality, Affordable
                </h3>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-700">
                <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-green-200">
                  <Check className="w-3 h-3 text-[#1B5E20]" /> Quality Assured
                </span>
                <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-green-200">
                  <Check className="w-3 h-3 text-[#1B5E20]" /> Best Prices
                </span>
                <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-green-200">
                  <Check className="w-3 h-3 text-[#1B5E20]" /> Wide Range
                </span>
              </div>

              <div>
                <Link
                  href="/shop?category=groceries"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#1B5E20] hover:bg-[#144718] transition-all"
                >
                  <span>Shop Groceries</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="w-28 sm:w-36 shrink-0">
              <img
                src="/images/groceries_basket.jpg"
                alt="Groceries"
                className="w-full h-auto object-contain rounded-lg drop-shadow"
              />
            </div>
          </div>

          {/* Right Rani Animal Feed Promo Bar */}
          <div className="bg-[#FFF4E6] border border-[#FFE0B2] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D87A1E] text-white flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#D87A1E] leading-tight">
                  RANI ANIMAL FEED – For Healthier Animals
                </h3>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-700">
                <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                  <Check className="w-3 h-3 text-[#D87A1E]" /> High Nutrition
                </span>
                <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                  <Check className="w-3 h-3 text-[#D87A1E]" /> Quality Guaranteed
                </span>
                <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                  <Check className="w-3 h-3 text-[#D87A1E]" /> Farmers' Choice
                </span>
              </div>

              <div>
                <Link
                  href="/shop?category=animal-feed"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#D87A1E] hover:bg-[#b56212] transition-all"
                >
                  <span>Shop Animal Feed</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="w-28 sm:w-36 shrink-0">
              <img
                src="/images/rani_animal_feed.jpg"
                alt="Rani Animal Feed"
                className="w-full h-auto object-contain rounded-lg drop-shadow"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
