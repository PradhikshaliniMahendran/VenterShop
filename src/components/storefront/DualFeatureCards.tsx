'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Check, ArrowRight, ShoppingBasket, Award } from 'lucide-react';

export default function DualFeatureCards() {
  const { language } = useTranslation();

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* 1. GROCERIES CARD */}
          <div className="bg-[#F3F8F3] border border-[#D5E8D4] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Content */}
            <div className="flex-1 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#1B5E20] text-white flex items-center justify-center shrink-0">
                  <ShoppingBasket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#1B5E20] uppercase tracking-tight">
                    {language === 'ta' ? 'மளிகைப் பொருட்கள்' : 'GROCERIES'}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium">
                    {language === 'ta' ? 'உங்கள் தினசரி அத்தியாவசிய பொருட்கள்' : 'Your daily essentials, now made easy.'}
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <ul className="space-y-2 text-xs font-semibold text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1B5E20] shrink-0 stroke-[3]" />
                  <span>{language === 'ta' ? 'புதிய மற்றும் தரமான பொருட்கள்' : 'Fresh & Quality Products'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1B5E20] shrink-0 stroke-[3]" />
                  <span>{language === 'ta' ? 'பரந்த அளவிலான மளிகை வகைகள்' : 'Wide Range of Groceries'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1B5E20] shrink-0 stroke-[3]" />
                  <span>{language === 'ta' ? 'குறைந்த மற்றும் மலிவு விலை' : 'Affordable Prices'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1B5E20] shrink-0 stroke-[3]" />
                  <span>{language === 'ta' ? 'வேகமான மற்றும் பாதுகாப்பான விநியோகம்' : 'Fast & Safe Delivery'}</span>
                </li>
              </ul>

              {/* CTA */}
              <div className="pt-2">
                <Link
                  href="/shop?category=groceries"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#1B5E20] hover:bg-[#144718] transition-all shadow-sm"
                >
                  <span>{language === 'ta' ? 'மளிகை பொருட்கள் வாங்க' : 'Shop Groceries'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="w-full md:w-48 lg:w-56 shrink-0 flex justify-center">
              <img
                src="/images/groceries_basket.jpg"
                alt="VenterShop Fresh Groceries"
                className="w-44 sm:w-52 h-auto object-contain rounded-xl drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* 2. RANI ANIMAL FEED CARD */}
          <div className="bg-[#FFF8F0] border border-[#FFE0B2] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Content */}
            <div className="flex-1 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#D87A1E] text-white flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#D87A1E] uppercase tracking-tight">
                    {language === 'ta' ? 'ராணி கால்நடை தீவனம்' : 'RANI ANIMAL FEED'}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium">
                    {language === 'ta' ? 'உங்கள் கால்நடைகளின் ஆரோக்கியத்திற்கான ஊட்டச்சத்து' : 'Nutrition that keeps your animals healthy.'}
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <ul className="space-y-2 text-xs font-semibold text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D87A1E] shrink-0 stroke-[3]" />
                  <span>{language === 'ta' ? 'கோழி, மாடு, ஆடு தீவனங்கள்' : 'Chicken, Cow, Goat Feeds'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D87A1E] shrink-0 stroke-[3]" />
                  <span>{language === 'ta' ? 'உயர் ஊட்டச்சத்து தரம்' : 'High Quality Nutrition'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D87A1E] shrink-0 stroke-[3]" />
                  <span>{language === 'ta' ? 'விவசாயிகளின் நம்பகமான தேர்வு' : 'Trusted by Farmers'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D87A1E] shrink-0 stroke-[3]" />
                  <span>{language === 'ta' ? 'உங்கள் இல்லத்திற்கே விநியோகம்' : 'Delivered to Your Doorstep'}</span>
                </li>
              </ul>

              {/* CTA */}
              <div className="pt-2">
                <Link
                  href="/shop?category=animal-feed"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#D87A1E] hover:bg-[#b56212] transition-all shadow-sm"
                >
                  <span>{language === 'ta' ? 'கால்நடை தீவனம் வாங்க' : 'Shop Animal Feed'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="w-full md:w-48 lg:w-56 shrink-0 flex justify-center">
              <img
                src="/images/rani_animal_feed.jpg"
                alt="Rani Animal Feed Canada"
                className="w-44 sm:w-52 h-auto object-contain rounded-xl drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
