'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Store, ArrowRight } from 'lucide-react';

export default function WhyShopBanner() {
  const { language } = useTranslation();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF8F0] border border-[#FFE8D1] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
          
          {/* Left info */}
          <div className="flex-1 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E67E22] text-white flex items-center justify-center shrink-0 shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-black text-[#B05A12] uppercase tracking-wide">
                {language === 'ta' ? 'வெண்டர்ஷாப்பில் ஏன் வாங்க வேண்டும்?' : 'WHY SHOP WITH VENTERSHOP?'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed max-w-xl">
                {language === 'ta'
                  ? 'கனடா முழுவதும் உள்ள எங்கள் வாடிக்கையாளர்களுக்கு தரமான பொருட்கள், கட்டுப்படியாகும் விலை மற்றும் சிறந்த சேவையை வழங்க நாங்கள் கடமைப்பட்டுள்ளோம்!'
                  : 'We are committed to providing quality products, affordable prices and the best service to our customers across Canada!'}
              </p>
            </div>
          </div>

          {/* Center 3D Storefront Graphic */}
          <div className="w-36 sm:w-44 shrink-0 flex justify-center">
            <img
              src="/images/storefront_3d.jpg"
              alt="VenterShop Canada Store"
              className="w-full h-auto object-contain rounded-xl drop-shadow-md"
            />
          </div>

          {/* Right Action Button */}
          <div className="shrink-0">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold text-white bg-[#1B5E20] hover:bg-[#144718] transition-all shadow-md"
            >
              <span>{language === 'ta' ? 'மேலும் அறிய' : 'Learn More'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
