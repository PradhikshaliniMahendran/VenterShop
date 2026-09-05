'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface ICategoryItem {
  _id?: string;
  title: string;
  slug: string;
  img: string;
}

const DEFAULT_CATEGORIES: ICategoryItem[] = [
  {
    title: 'Groceries &\nProvisions',
    slug: 'groceries',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Rani Animal\n& Pet Feed',
    slug: 'animal-feed',
    img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Home & Kitchen\nEssentials',
    slug: 'home',
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Books &\nStationery',
    slug: 'books',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Electronics &\nGadgets',
    slug: 'electronics',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Daily Needs &\nHygiene',
    slug: 'daily-needs',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Clothing &\nFashion',
    slug: 'daily-needs',
    img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Plants &\nGarden',
    slug: 'daily-needs',
    img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Gifts &\nSurprises',
    slug: 'daily-needs',
    img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
  },
];

const FALLBACK_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

// Single Minimalist Category Item without outer card box
function CategoryItem({ cat }: { cat: ICategoryItem }) {
  const [imgUrl, setImgUrl] = useState(cat.img || FALLBACK_CATEGORY_IMAGE);

  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      className="group flex-shrink-0 w-24 sm:w-28 flex flex-col items-center text-center p-1.5 snap-center select-none transition-transform duration-200"
    >
      {/* Square Rounded Graphic Frame */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#F8F8F8] border border-gray-150 p-2 flex items-center justify-center overflow-hidden shadow-xs group-hover:scale-108 group-hover:shadow-md group-hover:border-red-200 transition-all duration-300">
        <img
          src={imgUrl}
          alt={cat.title}
          onError={() => setImgUrl(FALLBACK_CATEGORY_IMAGE)}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
      </div>

      {/* Category Label */}
      <span className="text-[11px] font-bold text-gray-800 group-hover:text-[#801414] transition-colors whitespace-pre-line leading-tight mt-2 line-clamp-2">
        {cat.title}
      </span>
    </Link>
  );
}

export default function ShopByCategory() {
  const { language } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<ICategoryItem[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.categories && data.categories.length > 0) {
            const mapped: ICategoryItem[] = data.categories.map((c: any) => ({
              _id: c._id,
              title: c.name,
              slug: c.slug,
              img: c.image || FALLBACK_CATEGORY_IMAGE,
            }));
            if (mapped.length >= 3) {
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
            <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-widest font-sans">
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

        {/* Minimalist Single-line Horizontal Category Track without Card Borders */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat, idx) => (
              <CategoryItem key={cat._id || idx} cat={cat} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
