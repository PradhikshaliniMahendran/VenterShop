'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ICategoryData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function CategoryShowcase() {
  const { t, language } = useTranslation();
  const [categories, setCategories] = useState<ICategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (e) {
        console.error('Failed to load categories:', e);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const getLocalizedName = (cat: ICategoryData) => {
    if (language === 'ta') {
      if (cat.slug === 'groceries') return t('navGroceries');
      if (cat.slug === 'animal-feed') return t('navAnimalFeed');
      if (cat.slug === 'books') return t('navBooks');
      if (cat.slug === 'electronics') return t('navElectronics');
      if (cat.slug === 'daily-needs') return t('navDailyNeeds');
      if (cat.slug === 'home') return t('navHome');
    }
    return cat.name;
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = document.getElementById('category-carousel-scroll');
    if (el) {
      const scrollAmt = direction === 'left' ? -250 : 250;
      el.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-[#FAF7F2] text-xs font-semibold">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="h-6 w-32 bg-gray-205 rounded-md animate-pulse mx-auto" />
          <div className="h-8 w-48 bg-gray-205 rounded-md animate-pulse mx-auto" />
          <div className="flex gap-6 justify-center pt-8 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-40 animate-pulse">
                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-150" />
                <div className="h-4 w-16 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1A2A4A] text-white relative z-10 scroll-mt-20 overflow-hidden text-xs font-semibold">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-[0.3em] text-[#E53935] block">
            {language === 'ta' ? 'வகைகளை ஆராயுங்கள்' : 'EXPLORE BY CATEGORIES'}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {language === 'ta' ? 'எங்கள் தயாரிப்பு பிரிவுகள்' : 'Shop Collections'}
          </h2>
          <div className="w-16 h-0.5 bg-[#E53935]/80 mx-auto rounded-full shadow-[0_0_8px_rgba(229,57,53,0.8)]" />
        </div>

        {/* Carousel container */}
        <div className="relative group/carousel">
          
          {/* Scroll Buttons */}
          <button
            onClick={() => scrollCarousel('left')}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#E53935] hover:bg-white text-white hover:text-black shadow-lg items-center justify-center transition cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => scrollCarousel('right')}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#E53935] hover:bg-white text-white hover:text-black shadow-lg items-center justify-center transition cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Horizonal scrollable area */}
          <div
            id="category-carousel-scroll"
            className="flex gap-6 sm:gap-8 overflow-x-auto pb-6 pt-2 px-4 scrollbar-none snap-x snap-mandatory scroll-smooth items-center justify-start"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/shop?category=${category.slug}`}
                className="group flex-shrink-0 flex flex-col items-center gap-3.5 snap-center transition-transform duration-300 transform hover:-translate-y-2 text-center"
                style={{ width: '160px' }}
              >
                
                {/* Circular image frame with glowing red rings */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-[#E53935] via-amber-400 to-orange-500 shadow-[0_0_20px_rgba(229,57,53,0.35)] group-hover:shadow-[0_0_30px_rgba(229,57,53,0.65)] transition-all duration-500">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-[#1A2A4A] border-2 border-[#1A2A4A]">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-115"
                      style={{
                        backgroundImage: `url('${category.image || '/images/hero_banner.png'}')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />
                  </div>
                </div>

                {/* Category Label */}
                <span className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-[#E53935] transition-colors line-clamp-2 px-1 max-w-[140px]">
                  {getLocalizedName(category)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
