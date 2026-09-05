'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface ICategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

const DEFAULT_CATEGORIES = [
  {
    title: 'Fruits &\nVegetables',
    slug: 'groceries',
    img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'Kitchen &\nAppliances',
    slug: 'home',
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'Books &\nStationery',
    slug: 'books',
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'Clothing &\nFashion',
    slug: 'daily-needs',
    img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'Mobiles &\nElectronics',
    slug: 'electronics',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'Pet Care\nSupplies',
    slug: 'animal-feed',
    img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'Plants &\nGarden',
    slug: 'daily-needs',
    img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'Gifts &\nSurprises',
    slug: 'daily-needs',
    img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80',
  },
];

export default function ShopByCategory() {
  const { language } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.categories && data.categories.length > 0) {
            const mapped = data.categories.map((c: ICategoryItem) => ({
              title: c.name,
              slug: c.slug,
              img: c.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
            }));
            // Merge or fallback to full list
            if (mapped.length >= 4) {
              setCategories(mapped);
            }
          }
        }
      } catch (e) {
        console.error('Error fetching categories for slider:', e);
      }
    }
    fetchCategories();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-gray-100 overflow-hidden text-xs font-semibold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header with Navigation arrows and View All link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#801414] animate-pulse" />
            <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-widest">
              SHOP BY CATEGORY
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="text-xs font-bold text-[#801414] hover:underline flex items-center gap-1 hidden sm:flex"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-[#801414] hover:text-[#801414] text-gray-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-[#801414] hover:text-[#801414] text-gray-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Creative Single-line Horizontal Category Track */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/shop?category=${cat.slug}`}
                className="group flex-shrink-0 w-32 sm:w-36 flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-gray-150 hover:border-[#801414] hover:shadow-md transition-all duration-300 snap-center"
              >
                {/* Category Graphic Circle */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-50 border border-gray-200 p-1.5 flex items-center justify-center overflow-hidden shadow-xs group-hover:scale-105 group-hover:border-red-200 transition-all duration-300">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Title */}
                <span className="text-[11px] font-bold text-gray-800 group-hover:text-[#801414] transition-colors whitespace-pre-line leading-tight mt-2.5 line-clamp-2">
                  {cat.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
