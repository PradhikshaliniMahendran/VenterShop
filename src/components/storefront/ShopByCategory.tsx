'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function ShopByCategory() {
  const { language } = useTranslation();

  const categories = [
    {
      title: language === 'ta' ? 'பழங்கள் & காய்கறிகள்' : 'Fruits &\nVegetables',
      slug: 'groceries',
      img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80',
    },
    {
      title: language === 'ta' ? 'சமையலறை & உபகரணங்கள்' : 'Kitchen &\nAppliances',
      slug: 'daily-needs',
      img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80',
    },
    {
      title: language === 'ta' ? 'புத்தகங்கள் & எழுதுபொருட்கள்' : 'Books &\nStationery',
      slug: 'books',
      img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    },
    {
      title: language === 'ta' ? 'ஆடை & பேஷன்' : 'Clothing &\nFashion',
      slug: 'daily-needs',
      img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=300&q=80',
    },
    {
      title: language === 'ta' ? 'மொபைல் & எலக்ட்ரானிக்ஸ்' : 'Mobiles &\nElectronics',
      slug: 'electronics',
      img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
    },
    {
      title: language === 'ta' ? 'செல்லப்பிராணி பராமரிப்பு' : 'Pet Care\nSupplies',
      slug: 'animal-feed',
      img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80',
    },
    {
      title: language === 'ta' ? 'செடிகள் & தோட்டம்' : 'Plants &\nGarden',
      slug: 'daily-needs',
      img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80',
    },
    {
      title: language === 'ta' ? 'பரிசுகள் & ஆச்சரியங்கள்' : 'Gifts &\nSurprises',
      slug: 'daily-needs',
      img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with divider lines */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] bg-gray-300 w-16 sm:w-28" />
          <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-widest text-center">
            SHOP BY CATEGORY
          </h2>
          <div className="h-[1px] bg-gray-300 w-16 sm:w-28" />
        </div>

        {/* 8 Grid items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center text-center space-y-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {/* Circular image box */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#F8F8F8] border border-gray-150 p-2 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md group-hover:border-gray-300 transition-all duration-300">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <span className="text-[11px] font-bold text-gray-800 group-hover:text-[#801414] transition-colors whitespace-pre-line leading-tight">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
