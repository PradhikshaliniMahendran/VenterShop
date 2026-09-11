'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ShoppingCart, PawPrint, ArrowRight } from 'lucide-react';

export default function DualFeatureCards() {
  const { language } = useTranslation();
  const isTa = language === 'ta';

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-1">
          <span className="text-[11px] font-extrabold tracking-wider text-[#990000] uppercase block">
            {isTa ? 'எங்களின் சிறப்பு கடைகள் & சேவைகள்' : 'OUR FEATURED SHOPS & SERVICES'}
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            {isTa ? 'VENTERSHOP இல் எங்களின் சிறப்பு கடைகளை ஆராயுங்கள்' : 'Explore Our Special Shops on VENTERSHOP'}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-500">
            {isTa
              ? 'முக்கிய பொருட்கள், சிறப்பு உறுப்பினர் சேவைகள் மற்றும் பல – ஒரே தளத்தில்'
              : 'Key Products, Special Member Services & More – All in One Platform'}
          </p>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. PEOPLE'S MULTI SHOP */}
          <div className="bg-[#EEF7F2] border border-[#C8E6D3] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs hover:shadow-md transition-shadow">
            {/* Content */}
            <div className="flex-1 space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-[#15793B] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#15793B] tracking-tight">
                      PEOPLE&apos;S MULTI SHOP
                    </h3>
                    <p className="text-[11px] font-bold text-[#15793B]/90 uppercase tracking-wider">
                      {isTa ? 'உறுப்பினர்களுக்கான சிறப்பு ஷாப்பிங் & சேவைகள்' : 'Special Shopping & Services for Members'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-800 font-bold leading-relaxed bg-[#DDF2E4] px-2.5 py-1 rounded-md border border-[#C2E7CE] inline-block">
                    {isTa
                      ? 'மளிகை • உறுப்பினர்களின் தேர்வு • கோரிக்கைக்கேற்ப பொருட்கள் • சிறப்பு சேவைகள்'
                      : 'Groceries • Members’ Choice • Products on Request • Special Services'}
                  </p>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {isTa
                      ? 'எங்கள் உறுப்பினர்களின் அன்றாட தேவைகள் மற்றும் விருப்பங்களின் அடிப்படையில் பிரத்யேக விலைகள் மற்றும் தேர்ந்தெடுக்கப்பட்ட பொருட்கள்.'
                      : 'Exclusive prices and selected products based on our members’ everyday needs and preferences.'}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-1">
                <Link
                  href="/shop?category=groceries"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#15793B] hover:bg-[#0E5428] transition-all shadow-sm group"
                >
                  <span>{isTa ? 'இப்போதே வாங்கு' : 'Shop Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="w-36 sm:w-44 lg:w-48 shrink-0 flex justify-center">
              <img
                src="/images/groceries_basket.jpg"
                alt="People's Multi Shop Groceries"
                className="w-full h-auto object-contain rounded-xl drop-shadow-sm hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* 2. RANI ANIMAL FEED */}
          <div className="bg-[#FFF6ED] border border-[#FED7AA] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs hover:shadow-md transition-shadow">
            {/* Content */}
            <div className="flex-1 space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-[#F95700] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <PawPrint className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#F95700] tracking-tight">
                      RANI ANIMAL FEED
                    </h3>
                    <p className="text-[11px] font-bold text-[#F95700]/90 uppercase tracking-wider">
                      {isTa ? 'உள்ளூர் விவசாயிகள் மற்றும் உற்பத்தியை ஆதரித்தல்' : 'Supporting Local Farmers & Production'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-800 font-bold leading-relaxed bg-[#FFEAD6] px-2.5 py-1 rounded-md border border-[#FED7AA] inline-block">
                    {isTa
                      ? 'கோழி தீவனம் • மாட்டு தீவனம் • கால்நடை • செல்லப்பிராணி உணவு • மேலும் பல...'
                      : 'Poultry Feed • Cattle Feed • Livestock • Pet Food • And More...'}
                  </p>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {isTa
                      ? 'உள்ளூர் விவசாயிகள், கால்நடைகள் மற்றும் நிலையான உற்பத்தியை ஆதரிக்கும் உயர்தர தீவனங்கள் மற்றும் பொருட்கள்.'
                      : 'Quality feed and products to support local farmers, livestock and sustainable production.'}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-1">
                <Link
                  href="/shop?category=animal-feed"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#F95700] hover:bg-[#D44700] transition-all shadow-sm group"
                >
                  <span>{isTa ? 'இப்போதே வாங்கு' : 'Shop Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="w-36 sm:w-44 lg:w-48 shrink-0 flex justify-center">
              <img
                src="/images/rani_animal_feed.jpg"
                alt="Rani Animal Feed"
                className="w-full h-auto object-contain rounded-xl drop-shadow-sm hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
