'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';
import { Suspense } from 'react';

export default function AboutPage() {
  const { t, language } = useTranslation();

  const values = [
    {
      icon: <Award className="w-6 h-6 text-[#E53935]" />,
      title: 'Premium Quality',
      desc: 'We inspect every item in our multi-category catalogs to guarantee standard compliance.',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#E53935]" />,
      title: 'Reliable Canada Shipping',
      desc: 'Fast courier dispatching across all provinces with live order tracing timelines.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#E53935]" />,
      title: 'SSL Secure Transactions',
      desc: 'Our transaction safeguards prioritize client data protection and security.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] text-xs font-semibold">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>

      <main className="flex-grow max-w-5xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page header banner */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-[0.3em] text-[#E53935] block">
            {language === 'ta' ? 'எங்களைப் பற்றி' : 'OUR IDENTITY'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#1A2A4A] tracking-tight">
            {language === 'ta' ? 'வெண்டர்ஷாப் வரலாறு' : 'About VenterShop'}
          </h1>
          <div className="w-12 h-0.5 bg-[#E53935] mx-auto rounded-full" />
          <p className="text-sm text-gray-700 font-medium leading-relaxed pt-2">
            Established in 2026, VenterShop is Canada's premier multi-category e-commerce platform offering top-tier home goods, groceries, electronics, and feeds.
          </p>
        </div>

        {/* Narrative & Image Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs">
          <div className="space-y-4">
            <h2 className="text-lg font-black text-[#1A2A4A] uppercase tracking-wider">
              Our Backstory & Mission
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              VenterShop was founded with a singular vision: to connect Canadian households and businesses with high-quality retail essentials through an optimized, bilingual e-commerce pipeline.
            </p>
            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              By combining normal B2C shopping loops, local community group discount networks, and dedicated corporate wholesale B2B pipelines, we serve a diverse customer base with segment-optimized pricing matrices.
            </p>
          </div>
          <div className="h-64 rounded-2xl bg-cover bg-center border border-gray-150 relative overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80')" }}>
            <div className="absolute inset-0 bg-[#1A2A4A]/20" />
          </div>
        </div>

        {/* Core Values grid */}
        <div className="space-y-6">
          <h3 className="text-center font-extrabold text-sm text-[#1A2A4A] uppercase tracking-wider">
            Our Operating Values
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-200 flex flex-col items-center text-center space-y-3">
                <div className="p-2.5 bg-[#1A2A4A]/5 rounded-full border border-gray-100 flex items-center justify-center">
                  {val.icon}
                </div>
                <h4 className="font-extrabold text-[#1A2A4A] text-sm">{val.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium max-w-xs">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
