'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Percent, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function PricingSavingsCalculator() {
  const { t, language } = useTranslation();
  const [selectedSpend, setSelectedSpend] = useState<number>(150);

  // Savings calculations
  const normalPrice = selectedSpend;
  const communityPrice = Math.round(selectedSpend * 0.88 * 100) / 100; // 12% off average
  const wholesalePrice = Math.round(selectedSpend * 0.72 * 100) / 100; // 28% off average

  const communitySavingsAnnual = Math.round((normalPrice - communityPrice) * 12 * 100) / 100;
  const wholesaleSavingsAnnual = Math.round((normalPrice - wholesalePrice) * 12 * 100) / 100;

  return (
    <section className="py-16 bg-gradient-to-b from-[#101A2D] to-[#1A2A4A] text-white overflow-hidden relative">
      {/* Glow ambient background accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E53935]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 py-1 px-3 bg-red-500/10 border border-red-500/20 text-[#FF8A80] rounded-full text-[10px] font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Savings Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
            {language === 'ta' ? 'உங்கள் சேமிப்பைக் கணக்கிடுங்கள்' : 'Calculate Your Membership Savings'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-semibold leading-relaxed">
            See how much you save on groceries, feeds, and supplies with our multi-tier member pricing structure.
          </p>
        </div>

        {/* Spend Slider */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
            <span className="text-gray-300">Estimated Monthly Shopping Volume:</span>
            <span className="text-xl font-black text-[#FF8A80]">${selectedSpend} / month</span>
          </div>

          <input
            type="range"
            min="50"
            max="1000"
            step="25"
            value={selectedSpend}
            onChange={(e) => setSelectedSpend(Number(e.target.value))}
            className="w-full h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E53935]"
          />

          <div className="flex justify-between text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
            <span>$50 / mo</span>
            <span>$500 / mo</span>
            <span>$1,000 / mo</span>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Normal Retail */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-md text-gray-300 block w-fit">
                Standard Member
              </span>
              <h3 className="text-lg font-black">Retail Shopper</h3>
              <p className="text-xs text-gray-400 font-semibold">Standard catalog prices with seasonal discounts and promotional vouchers.</p>
              
              <div className="pt-4 border-t border-white/10">
                <span className="text-2xl font-black text-white">${normalPrice.toFixed(2)}</span>
                <span className="text-xs text-gray-400"> / month</span>
              </div>
            </div>

            <ul className="text-xs text-gray-300 space-y-2 font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Access to all products</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free delivery on $75+</span>
              </li>
            </ul>

            <Link
              href="/login"
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-center font-bold text-xs uppercase tracking-wider rounded-xl transition-colors block"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Card 2: Community Member (POPULAR) */}
          <div className="bg-gradient-to-b from-[#1A2A4A] to-[#101A2D] border-2 border-[#E53935] p-6 rounded-2xl flex flex-col justify-between space-y-6 relative shadow-2xl scale-102">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E53935] text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-md">
              MOST POPULAR CHOICE
            </div>

            <div className="space-y-4 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-500/20 text-[#FF8A80] px-2.5 py-1 rounded-md block w-fit">
                Community Partner
              </span>
              <h3 className="text-lg font-black text-white">Community Member</h3>
              <p className="text-xs text-gray-300 font-semibold">Joined a local community group for instant tier discounts & targeted vouchers.</p>
              
              <div className="pt-4 border-t border-white/10">
                <span className="text-3xl font-black text-emerald-400">${communityPrice.toFixed(2)}</span>
                <span className="text-xs text-gray-300"> / month</span>
                <div className="text-[11px] text-emerald-400 font-extrabold mt-1">
                  Save ${communitySavingsAnnual.toFixed(2)} / year
                </div>
              </div>
            </div>

            <ul className="text-xs text-gray-200 space-y-2 font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Save ~12% on everyday items</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Exclusive regional vouchers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click free instant join</span>
              </li>
            </ul>

            <Link
              href="/#community-section"
              className="w-full py-3 bg-[#E53935] hover:bg-[#c62828] text-white text-center font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Join Community Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: B2B Wholesale */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-md block w-fit">
                Corporate B2B
              </span>
              <h3 className="text-lg font-black">Wholesale Buyer</h3>
              <p className="text-xs text-gray-400 font-semibold">Designed for retailers, restaurants, and high-volume commercial buyers.</p>
              
              <div className="pt-4 border-t border-white/10">
                <span className="text-2xl font-black text-blue-300">${wholesalePrice.toFixed(2)}</span>
                <span className="text-xs text-gray-400"> / month</span>
                <div className="text-[11px] text-blue-300 font-extrabold mt-1">
                  Save ${wholesaleSavingsAnnual.toFixed(2)} / year
                </div>
              </div>
            </div>

            <ul className="text-xs text-gray-300 space-y-2 font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Up to 28%+ bulk discounts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Bulk pricing matrix tiers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Priority order processing</span>
              </li>
            </ul>

            <Link
              href="/dashboard/wholesale"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold text-xs uppercase tracking-wider rounded-xl transition-colors block"
            >
              Apply for Wholesale
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
