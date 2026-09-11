'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ArrowRight, Gift, Percent, GraduationCap, Home } from 'lucide-react';

export default function PromoBanners() {
  const { language } = useTranslation();
  const isTa = language === 'ta';

  return (
    <section className="py-6 sm:py-8 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* COMMUNITY GIFT VOUCHERS BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#7B0000] via-[#8D0606] to-[#6A0000] p-6 sm:p-8 text-white overflow-hidden shadow-xl border border-red-900/40">
          
          {/* Subtle Decorative Background Glows */}
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-yellow-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            
            {/* Left Column: Gift Box Icon + Text Info */}
            <div className="lg:col-span-6 flex items-start gap-4 sm:gap-5">
              
              {/* Gift Box Graphic Frame with % Badge */}
              <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-2 border border-red-400/30 flex items-center justify-center shadow-lg group">
                <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 drop-shadow-md group-hover:scale-110 transition-transform duration-300 stroke-[2.5]" />
                
                {/* Floating Ribbon Percent Badge */}
                <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-red-950 w-5 h-5 rounded-full shadow-md flex items-center justify-center text-[10px] font-black">
                  %
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 flex-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase leading-tight">
                  {isTa ? 'சமூக பரிசு வவுச்சர்கள்' : 'COMMUNITY GIFT VOUCHERS'}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-white/95">
                  {isTa ? 'கல்வி மற்றும் சமூகப் பராமரிப்பிற்கு ஆதரவளித்தல்' : 'Supporting Education & Community Care'}
                </p>
                
                {/* Yellow Underline Accent */}
                <div className="w-12 h-1 bg-yellow-400 rounded-full my-1.5" />

                <p className="text-[11px] sm:text-xs text-red-100/90 font-medium leading-relaxed pt-0.5">
                  {isTa
                    ? 'எங்கள் சமூகத் திட்டங்கள் மூலம் வழங்கப்படும் பரிசு வவுச்சர்கள் மாணவர்கள் மற்றும் குடும்பங்கள் VENTERSHOP மூலம் அத்தியாவசிய பொருட்களைப் பெற உதவுகின்றன.'
                    : 'Gift vouchers provided through our community programmes help students and families access essential items through VENTERSHOP.'}
                </p>
              </div>
            </div>

            {/* Right Column: 2 Voucher Interactive Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 1. Student Gift Voucher Card (Status: ON) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 text-gray-900 shadow-lg border border-gray-100 flex flex-col justify-between space-y-3">
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F1FD] text-[#0055D4] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <GraduationCap className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-[#003B7A] leading-tight truncate">
                      {isTa ? 'மாணவர் பரிசு வவுச்சர்' : 'Student Gift Voucher'}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-semibold">Supported by</p>
                    <span className="inline-block bg-[#E8F1FD] text-[#0055D4] text-[9px] font-extrabold px-2 py-0.5 rounded-md truncate max-w-full">
                      Educating Bank System of V2CC
                    </span>
                  </div>
                </div>

                {/* Status Toggle Display: ON */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                  <span className="text-gray-600 font-bold text-[11px]">Status:</span>
                  <div className="inline-flex items-center gap-1.5 bg-[#00A859] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
                    <span>ON</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  </div>
                </div>

                {/* CTA Action Button */}
                <Link
                  href="/vouchers#student"
                  className="w-full py-2 px-3 bg-[#0066E6] hover:bg-[#0052B8] text-white text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all text-center"
                >
                  <span>{isTa ? 'மாணவர் வவுச்சரைப் பயன்படுத்துக' : 'Use Student Voucher'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 2. Family Support Voucher Card (Status: OFF) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 text-gray-900 shadow-lg border border-gray-100 flex flex-col justify-between space-y-3">
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F8EE] text-[#0E703C] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Home className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-[#0E703C] leading-tight truncate">
                      {isTa ? 'குடும்ப ஆதரவு வவுச்சர்' : 'Family Support Voucher'}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-semibold">Supported by</p>
                    <span className="inline-block bg-[#E8F8EE] text-[#0E703C] text-[9px] font-extrabold px-2 py-0.5 rounded-md truncate max-w-full">
                      TMSAP Project of V2CC
                    </span>
                  </div>
                </div>

                {/* Status Toggle Display: OFF */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                  <span className="text-gray-600 font-bold text-[11px]">Status:</span>
                  <div className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                    <span>OFF</span>
                  </div>
                </div>

                {/* CTA Action Button */}
                <Link
                  href="/vouchers#family"
                  className="w-full py-2 px-3 bg-white hover:bg-gray-50 text-[#0066E6] border border-[#0066E6]/30 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all text-center"
                >
                  <span>{isTa ? 'விபரங்களைப் பார்க்க' : 'View Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
