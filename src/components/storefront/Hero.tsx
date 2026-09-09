'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ShoppingCart, CheckCircle2, MapPin, Store } from 'lucide-react';

export default function Hero() {
  const { language } = useTranslation();
  const isTa = language === 'ta';

  return (
    <div className="w-full bg-[#FCFAF7] border-b border-gray-100">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headings, Subtitle, Bullet Checklist, Action Buttons */}
          <div className="lg:col-span-6 space-y-5 text-left">
            
            {/* Top Sub-taglines */}
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-gray-700 tracking-tight">
                {isTa ? 'ஷாப்பிங் வாய்ப்புகளை சந்திக்கும் இடம்.' : 'Where Shopping Meets Opportunity.'}
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-700 tracking-tight">
                {isTa ? 'யோசனைகள் வணிகங்களாக மாறும் இடம்.' : 'Where Ideas Become Businesses.'}
              </p>
            </div>

            {/* Giant Brand Name */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-[#801414] leading-none">
              VENTERSHOP
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed max-w-lg">
              {isTa
                ? 'தயாரிப்புகளைக் கண்டறியவும், வர்ச்சுவல் கடைகளை ஆராயவும், வாய்ப்புகளுக்காக உருவாக்கப்பட்ட சந்தையுடன் வளரவும்.'
                : 'Discover products, explore virtual shops, and grow with a marketplace built for opportunity.'}
            </p>

            {/* Checklist items */}
            <div className="space-y-2 pt-1 text-xs sm:text-sm font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#801414] shrink-0 fill-red-50" />
                <span>{isTa ? 'பரந்த அளவிலான தயாரிப்புகள்' : 'Wide Range of Products'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#801414] shrink-0 fill-red-50" />
                <span>{isTa ? 'தொழில்முனைவோருக்கான வர்ச்சுவல் கடைகள்' : 'Virtual Shops for Entrepreneurs'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#801414] shrink-0 fill-red-50" />
                <span>{isTa ? 'வாங்குபவர்களையும் விற்பனையாளர்களையும் இணைத்தல்' : 'Connecting Buyers & Sellers'}</span>
              </div>
            </div>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-xs font-bold text-white bg-[#801414] hover:bg-[#630f0f] transition-all shadow-md transform hover:-translate-y-0.5 active:scale-98"
              >
                <Store className="w-4 h-4" />
                <span>{isTa ? 'கடைகளை ஆராய்க' : 'Explore Shops'}</span>
              </Link>

              <Link
                href="/shop?category=groceries"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-xs font-bold text-white bg-[#1B5E20] hover:bg-[#144718] transition-all shadow-md transform hover:-translate-y-0.5 active:scale-98"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isTa ? 'மளிகை பொருட்கள் வாங்க' : 'Shop Groceries'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Graphic Banner Image */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg lg:max-w-none rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="/images/hero_woman.jpg"
                alt="VenterShop Marketplace"
                className="w-full h-auto object-cover transform hover:scale-101 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Location Strip */}
      <div className="w-full bg-[#FAF5EE] border-t border-b border-amber-100/60 py-2 px-4 text-center">
        <p className="text-xs sm:text-sm font-semibold text-amber-900 flex items-center justify-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#801414] shrink-0" />
          <span>{isTa ? 'இலங்கை முழுவதும் இல்லங்களுக்கு விநியோகம்.' : 'Delivering across Sri Lanka.'}</span>
        </p>
      </div>
    </div>
  );
}
