'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Users,
  Award,
  Briefcase,
} from 'lucide-react';

export default function TrustSection() {
  const { t, language } = useTranslation();

  const trustItems = [
    {
      icon: <Award className="w-6 h-6 text-[#D4AF37]" />,
      title: t('trustItem1Title'),
      desc: t('trustItem1Desc'),
    },
    {
      icon: <Truck className="w-6 h-6 text-[#D4AF37]" />,
      title: t('trustItem2Title'),
      desc: t('trustItem2Desc'),
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />,
      title: t('trustItem3Title'),
      desc: t('trustItem3Desc'),
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#D4AF37]" />,
      title: t('trustItem4Title'),
      desc: t('trustItem4Desc'),
    },
    {
      icon: <Users className="w-6 h-6 text-[#D4AF37]" />,
      title: language === 'ta' ? 'சமூக நன்மைகள்' : 'Community Benefits',
      desc: language === 'ta' 
        ? 'தனிப்பயன் சமூகக் குழுக்களுடன் இணைந்து பிரத்தியேக சலுகைகளையும் தள்ளுபடி குறியீடுகளையும் அன்லாக் செய்யுங்கள்.'
        : 'Join custom community programs to unlock localized pricing tiers and exclusive community vouchers.',
    },
    {
      icon: <Briefcase className="w-6 h-6 text-[#D4AF37]" />,
      title: language === 'ta' ? 'மொத்த விநியோகம்' : 'Wholesale Solutions',
      desc: language === 'ta'
        ? 'கனடிய வணிகர்களுக்கான மொத்த விலைகள், அடுக்குத் தள்ளுபடிகள் மற்றும் எளிதான பல்க் ஆர்டர் செக்அவுட் வசதி.'
        : 'Dedicated B2B account tier with wholesale pricing, bulk discount matrices, and optimized volume checkouts.',
    },
  ];

  return (
    <section className="py-24 bg-[#FAF7F2] text-[#071B5C] border-y border-gray-200 text-xs font-semibold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-[0.3em] text-[#E53935] block">
            {language === 'ta' ? 'எங்கள் நன்மைகள்' : 'OUR VALUE PROPOSITIONS'}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#071B5C] tracking-tight">
            {t('trustTitle')}
          </h2>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto rounded-full" />
          <p className="text-sm text-gray-500 font-medium leading-relaxed pt-2">
            {language === 'ta'
              ? 'கனடா முழுவதும் ஆயிரக்கணக்கான குடும்பங்களால் நம்பப்படும் எங்களின் முக்கிய நன்மைகள்.'
              : 'Discover why thousands of households and businesses across Canada trust us for their daily essentials.'}
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-white rounded-3xl border border-gray-200/60 flex flex-col items-center text-center space-y-4 hover:shadow-md hover:border-[#D4AF37]/35 transition-all duration-200"
            >
              {/* Icon Container */}
              <div className="p-3 bg-[#071B5C]/5 rounded-full border border-[#071B5C]/10 flex items-center justify-center">
                {item.icon}
              </div>
              
              {/* Text info */}
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-[#071B5C]">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
