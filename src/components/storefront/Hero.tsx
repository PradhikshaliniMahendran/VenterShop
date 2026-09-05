'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ShoppingCart, CheckCircle2, MapPin } from 'lucide-react';

export default function Hero() {
  const { language } = useTranslation();

  return (
    <div className="w-full bg-[#FCFAF7] border-b border-gray-100">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headings, Bullet Checklist, Action Buttons */}
          <div className="lg:col-span-6 space-y-5 text-left">
            
            {/* Top Sub-tagline */}
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-gray-700 tracking-tight">
                {language === 'ta' ? 'ஒவ்வொரு தேவைக்கும் ஒரு கடை.' : 'A Shop for Every Need.'}
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-700 tracking-tight">
                {language === 'ta' ? 'ஒவ்வொரு இல்லத்திலும் ஒரு நம்பிக்கை துணை.' : 'A Partner in Every Home.'}
              </p>
            </div>

            {/* Giant Brand Name */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-[#801414] leading-none">
              VENTERSHOP
            </h1>

            {/* Checklist items */}
            <div className="space-y-2 pt-1 text-xs sm:text-sm font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#801414] shrink-0 fill-red-50" />
                <span>{language === 'ta' ? 'உயர்தர நம்பகமான தயாரிப்புகள்' : 'Best Quality Products'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#801414] shrink-0 fill-red-50" />
                <span>{language === 'ta' ? 'நம்பகமான மற்றும் பாதுகாப்பான சேவை' : 'Trusted & Reliable Service'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#801414] shrink-0 fill-red-50" />
                <span>{language === 'ta' ? 'வேகமான மற்றும் பாதுகாப்பான விநியோகம்' : 'Fast & Secure Delivery'}</span>
              </div>
            </div>

            {/* Subtext description */}
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed max-w-lg">
              {language === 'ta'
                ? 'மளிகைப் பொருட்கள் முதல் கால்நடை தீவனம் வரை, உங்கள் வீட்டு வாசலுக்கே கொண்டு சேர்க்கிறோம்.'
                : 'From groceries to animal feed, we bring quality and care to your doorstep.'}
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/shop?category=groceries"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-xs font-bold text-white bg-[#1B5E20] hover:bg-[#144718] transition-all shadow-md transform hover:-translate-y-0.5 active:scale-98"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{language === 'ta' ? 'மளிகை பொருட்கள் வாங்க' : 'Shop Groceries'}</span>
              </Link>

              <Link
                href="/shop?category=animal-feed"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-xs font-bold text-white bg-[#801414] hover:bg-[#630f0f] transition-all shadow-md transform hover:-translate-y-0.5 active:scale-98"
              >
                <span className="text-sm">🌾</span>
                <span>{language === 'ta' ? 'கால்நடை தீவனம் வாங்க' : 'Shop Animal Feed'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Graphic Banner Image */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg lg:max-w-none rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="/images/hero_woman.jpg"
                alt="VenterShop Delivery and Groceries"
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
          <span>Delivering to homes across Canada.</span>
        </p>
      </div>
    </div>
  );
}
