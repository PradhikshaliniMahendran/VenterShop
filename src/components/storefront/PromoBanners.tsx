'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ArrowRight, Tag, Gift, Percent } from 'lucide-react';

export default function PromoBanners() {
  const { language } = useTranslation();
  const isTa = language === 'ta';

  return (
    <section className="py-6 sm:py-8 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Special Offers Banner matching Client Mockup Image */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#7D0000] via-[#901414] to-[#6A0000] p-6 sm:p-8 text-white overflow-hidden shadow-xl border border-red-900/40">
          
          {/* Subtle Decorative Background Glows */}
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-yellow-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* Left Gift Box Visual */}
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
              {/* Gift Box Graphic Frame */}
              <div className="relative shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-2 border border-red-400/30 flex items-center justify-center shadow-lg group">
                <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-300 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                
                {/* Floating Ribbon Accent */}
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-950 p-1.5 rounded-full shadow-md">
                  <Percent className="w-4 h-4 font-black" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {isTa ? 'சிறப்பு சலுகைகள்' : 'Special Offers'}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-red-100/90">
                  {isTa
                    ? 'உங்களுக்குப் பிடித்த தயாரிப்புகளுக்குச் சிறந்த சலுகைகள்'
                    : 'Great Deals on Your Favourite Products'}
                </p>
                {/* Underline accent */}
                <div className="w-12 h-1 bg-yellow-400 rounded-full mt-2" />
              </div>
            </div>

            {/* Right Action Button & Yellow Tag Graphic */}
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              
              {/* White Pill Button */}
              <Link
                href="/shop?offers=true"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-yellow-300 text-[#801414] font-black text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span>{isTa ? 'சலுகைகளை வாங்குங்கள்' : 'Shop Offers'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Yellow Discount Tag Badge */}
              <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-[#FFB800] rounded-2xl rotate-12 flex flex-col items-center justify-center shadow-lg border-2 border-yellow-200 text-[#801414]">
                <Tag className="w-6 h-6 fill-current" />
                <span className="text-[11px] font-black tracking-tighter uppercase mt-0.5">% OFF</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
