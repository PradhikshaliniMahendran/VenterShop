'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Hero() {
  const { t, language } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=85',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=2000&q=85',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=2000&q=85',
  ];

  // Auto rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full min-h-[90vh] sm:min-h-screen flex items-center justify-center bg-[#101A2D] overflow-hidden pt-20 pb-24 text-xs font-semibold">
      
      {/* Background Images with slideshow transitions */}
      {slides.map((url, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center bg-no-repeat ${
            idx === activeSlide ? 'opacity-30 scale-102' : 'opacity-0 scale-100'
          }`}
          style={{
            backgroundImage: `url('${url}')`,
            transitionProperty: 'opacity, transform',
            transitionDuration: '1000ms, 8000ms',
          }}
        />
      ))}

      {/* Navy gradient overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#101A2D]/90 via-[#101A2D]/45 to-[#101A2D]/55 pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[radial-gradient(#E53935_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Main Content Card */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 w-full text-white">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#101A2D]/90 border border-[#E53935]/65 backdrop-blur-md shadow-[0_4px_20px_rgba(16,26,45,0.5)]">
          <Sparkles className="w-4 h-4 text-[#E53935] animate-pulse" />
          <span className="text-[10px] uppercase font-black tracking-[0.25em] text-[#E53935]">
            {language === 'ta' ? 'வெண்டர்ஷாப் • கனடா' : 'VENTERSHOP • CANADA'}
          </span>
        </div>

        {/* Headline */}
        <h1 className={`font-serif font-black tracking-tight text-white drop-shadow-2xl ${
          language === 'ta'
            ? 'text-4xl sm:text-6xl lg:text-7xl leading-snug'
            : 'text-5xl sm:text-7xl lg:text-8xl leading-[0.98]'
        }`}>
          {language === 'ta' ? (
            <>
              உயர்தர பொருட்கள் <br />
              <span className="text-[#E53935] italic" style={{ textShadow: '0 0 20px rgba(229,57,53,0.45)' }}>
                உங்கள் இல்லத்தில்
              </span>
            </>
          ) : (
            <>
              QUALITY PRODUCTS <br />
              <span className="text-[#E53935] italic" style={{ textShadow: '0 0 20px rgba(229,57,53,0.45)' }}>
                AT YOUR DOORSTEP
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-medium leading-relaxed drop-shadow-md">
          {t('heroSubtitle')}
        </p>

        {/* Crimson divider line */}
        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#E53935] to-transparent mx-auto rounded-full" />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest text-white bg-[#E53935] hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(229,57,53,0.3)] transform hover:-translate-y-0.5 active:scale-98"
          >
            <span>{t('heroShopNow')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop#categories"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest text-white bg-[#1A2A4A]/90 hover:bg-[#101A2D] transition-all duration-300 border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.35)] transform hover:-translate-y-0.5 active:scale-98"
          >
            <span>{t('heroExplore')}</span>
          </Link>
        </div>

        {/* Slide Bullets */}
        <div className="pt-8 flex justify-center items-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === activeSlide ? 'w-8 bg-[#E53935] shadow-[0_0_10px_rgba(229,57,53,0.6)]' : 'w-2.5 bg-white/40 hover:bg-white'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Pinned Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10 select-none">
        <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/70">SCROLL TO ENTER</span>
        <div className="w-[2px] h-8 bg-white/30 relative overflow-hidden rounded-full">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#E53935] animate-[bounce_1.5s_infinite]" />
        </div>
      </div>
    </section>
  );
}
