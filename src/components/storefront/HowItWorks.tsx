'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  PhoneCall,
  ClipboardList,
  CreditCard,
  ShoppingBag,
  Truck,
  HeartHandshake,
} from 'lucide-react';

export default function HowItWorks() {
  const { language } = useTranslation();

  const steps = [
    {
      num: '01',
      icon: PhoneCall,
      title: language === 'ta' ? 'தேர்ந்தெடுக்கவும்' : 'Browse & Select',
      desc: language === 'ta' ? 'எங்கள் தயாரிப்புகளை பார்வையிட்டு கார்ட்டில் சேர்க்கவும்.' : 'Explore our wide range of products and add to cart.',
    },
    {
      num: '02',
      icon: ClipboardList,
      title: language === 'ta' ? 'ஆர்டர் செய்யவும்' : 'Place Your Order',
      desc: language === 'ta' ? 'உங்கள் முகவரியை உள்ளிட்டு ஆர்டரை உறுதி செய்யவும்.' : 'Fill in your details and confirm your order.',
    },
    {
      num: '03',
      icon: CreditCard,
      title: language === 'ta' ? 'பாதுகாப்பான கட்டணம்' : 'Secure Payment',
      desc: language === 'ta' ? 'பாதுகாப்பான முறையில் எளிதாக கட்டணம் செலுத்தவும்.' : 'Choose a safe payment method and pay easily.',
    },
    {
      num: '04',
      icon: ShoppingBag,
      title: language === 'ta' ? 'ஆர்டர் பேக்கிங்' : 'We Pack Your Order',
      desc: language === 'ta' ? 'உங்கள் பொருட்களை கவனமாகவும் தரமாகவும் பேக் செய்கிறோம்.' : 'Our team packs your order with care and quality.',
    },
    {
      num: '05',
      icon: Truck,
      title: language === 'ta' ? 'வேகமான விநியோகம்' : 'Fast Delivery',
      desc: language === 'ta' ? 'விரைவாகவும் பாதுகாப்பாகவும் உங்கள் இல்லம் சேர்க்கிறோம்.' : 'We deliver your order quickly and safely.',
    },
    {
      num: '06',
      icon: HeartHandshake,
      title: language === 'ta' ? 'மகிழ்வுடன் பெறுங்கள்' : 'Receive & Enjoy',
      desc: language === 'ta' ? 'பொருட்களைப் பெற்று சிறந்த தரத்தை அனுபவியுங்கள்.' : 'Receive your products and enjoy the best quality.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FDFDFD] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        
        {/* Section Heading */}
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-wider uppercase font-sans">
          HOW VENTERSHOP WORKS?
        </h2>

        {/* 6 Step Grid with connectors */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4 relative">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center space-y-3 relative group">
                
                {/* Number Badge with Icon */}
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-gray-300 group-hover:border-[#1B5E20] transition-colors flex items-center justify-center shadow-sm">
                    <IconComponent className="w-7 h-7 text-gray-700 group-hover:text-[#1B5E20] transition-colors" />
                  </div>
                  {/* Green Step Number Pill */}
                  <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#1B5E20] text-white text-[10px] font-black flex items-center justify-center shadow">
                    {step.num}
                  </span>
                </div>

                {/* Title & Desc */}
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#1B5E20] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
