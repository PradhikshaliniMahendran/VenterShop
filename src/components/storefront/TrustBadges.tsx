'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  ShieldCheck,
  Truck,
  Award,
  Headphones,
  RotateCcw,
} from 'lucide-react';

export default function TrustBadges() {
  const { language } = useTranslation();

  const badges = [
    {
      icon: ShieldCheck,
      title: language === 'ta' ? '100% பாதுகாப்பான கட்டணம்' : language === 'si' ? '100% ආරක්ෂිත ගෙවීම්' : '100% Secure Payments',
      desc: language === 'ta' ? 'உங்கள் பரிவர்த்தனைகள் பாதுகாப்பானவை.' : language === 'si' ? 'ඔබගේ ගෙවීම් අප සමඟ සුරක්ෂිතයි.' : 'Your payments are safe with us.',
    },
    {
      icon: Truck,
      title: language === 'ta' ? 'வேகமான நம்பகமான டெலிவரி' : language === 'si' ? 'වේගවත් බෙදාහැරීම' : 'Fast & Reliable Delivery',
      desc: language === 'ta' ? 'கனடா முழுவதும் விநியோகம்.' : language === 'si' ? 'කැනඩාව පුරා බෙදාහැරීම.' : 'Delivery across Canada.',
    },
    {
      icon: Award,
      title: language === 'ta' ? 'தர உறுதிப்பாடு' : language === 'si' ? 'ගුණාත්මකභාවය' : 'Quality Assurance',
      desc: language === 'ta' ? 'உங்களுக்காக சிறந்த தயாரிப்புகள் மட்டுமே.' : language === 'si' ? 'ඔබ සඳහා හොඳම දේ පමණි.' : 'Only the best for you.',
    },
    {
      icon: Headphones,
      title: language === 'ta' ? 'வாடிக்கையாளர் ஆதரவு' : language === 'si' ? 'පාරිභෝගික සහාය' : 'Customer Support',
      desc: language === 'ta' ? 'உங்களுக்கு உதவ நாங்கள் தயாராக உள்ளோம்.' : language === 'si' ? 'ඔබට උපකාර කිරීමට අපි සූදානම්.' : "We're here to help you.",
    },
    {
      icon: RotateCcw,
      title: language === 'ta' ? 'எளிதான ரிட்டர்ன்ஸ்' : language === 'si' ? 'පහසු ආපසු ලබාදීම්' : 'Easy Returns',
      desc: language === 'ta' ? 'சிரமமில்லாத பணத்தைத் திரும்பப்பெறுதல்.' : language === 'si' ? 'කරදරයකින් තොර මුදල් ආපසු ලබාදීම.' : 'Hassle free returns & refunds.',
    },
  ];

  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {badges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center space-y-2 p-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700">
                  <Icon className="w-5 h-5 text-gray-700 stroke-[1.75]" />
                </div>
                <h4 className="text-xs font-bold text-gray-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 font-medium">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
