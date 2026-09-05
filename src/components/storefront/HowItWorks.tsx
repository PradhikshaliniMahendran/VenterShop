'use client';

import React, { useRef } from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  PhoneCall,
  ClipboardList,
  CreditCard,
  ShoppingBag,
  Truck,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export default function HowItWorks() {
  const { language } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-[#FDFDFD] border-b border-gray-100 overflow-hidden text-xs font-semibold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header with Navigation arrows */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E20] animate-pulse" />
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-wider uppercase font-sans">
              HOW VENTERSHOP WORKS?
            </h2>
          </div>

          {/* Desktop & Mobile Scroll arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-[#1B5E20] hover:text-[#1B5E20] text-gray-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-[#1B5E20] hover:text-[#1B5E20] text-gray-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Creative Single-line Horizontal Process Track */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              const isLast = idx === steps.length - 1;
              return (
                <div
                  key={idx}
                  className="flex-shrink-0 w-52 sm:w-60 bg-white rounded-2xl border border-gray-200 p-4.5 shadow-xs hover:shadow-md hover:border-[#1B5E20] transition-all duration-300 flex flex-col justify-between snap-center group relative"
                >
                  {/* Top Step Pill & Number */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="w-7 h-7 rounded-xl bg-[#1B5E20] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                      {step.num}
                    </span>
                    <div className="p-2 rounded-xl bg-green-50/70 text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="pt-3 space-y-1">
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#1B5E20] transition-colors line-clamp-1">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">
                      {step.desc}
                    </p>
                  </div>

                  {/* Flow Connector Indicator at Bottom */}
                  <div className="pt-3 flex items-center justify-between text-[10px] text-gray-400 font-bold border-t border-gray-50 mt-2">
                    <span>Step {idx + 1} of 6</span>
                    {!isLast ? (
                      <span className="text-[#1B5E20] flex items-center gap-0.5">
                        Next <ArrowRight className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-extrabold">Complete 🎉</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
