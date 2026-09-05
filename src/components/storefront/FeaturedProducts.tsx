'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  badge: { label: string; type: 'best_seller' | 'popular' | 'new' };
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
}

const DEFAULT_FEATURED: ProductItem[] = [
  {
    _id: 'ponni-rice-5kg',
    name: 'Ponni Rice 5kg',
    slug: 'ponni-rice-5kg',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Premium quality rice',
    price: 12.50,
    rating: 5,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'sun-flower-oil-1l',
    name: 'Sun Flower Oil 1L',
    slug: 'sun-flower-oil-1l',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: '100% pure sunflower oil',
    price: 4.50,
    rating: 5,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'rani-chicken-feed-10kg',
    name: 'RANI Chicken Feed 10kg',
    slug: 'rani-chicken-feed-10kg',
    badge: { label: 'Popular', type: 'popular' },
    description: 'High nutrition for chickens',
    price: 11.50,
    rating: 5,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'rani-cow-feed-25kg',
    name: 'RANI Cow Feed 25kg',
    slug: 'rani-cow-feed-25kg',
    badge: { label: 'Popular', type: 'popular' },
    description: 'Complete feed for cows',
    price: 23.50,
    rating: 5,
    reviewsCount: 87,
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'wireless-headphones',
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    badge: { label: 'New Arrival', type: 'new' },
    description: 'High quality sound',
    price: 24.90,
    rating: 5,
    reviewsCount: 54,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: 'soft-blankets',
    name: 'Soft Blankets',
    slug: 'soft-blankets',
    badge: { label: 'Best Seller', type: 'best_seller' },
    description: 'Warm & comfortable',
    price: 18.90,
    rating: 5,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80',
  },
];

export default function FeaturedProducts() {
  const { language } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_FEATURED);

  const handleAddToCart = (e: React.MouseEvent, prod: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod._id, 1);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with divider lines */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] bg-gray-300 w-16 sm:w-28" />
          <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-widest text-center">
            FEATURED PRODUCTS
          </h2>
          <div className="h-[1px] bg-gray-300 w-16 sm:w-28" />
        </div>

        {/* 6 Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {products.map((prod) => {
            const isRedBadge = prod.badge.type === 'popular';
            return (
              <div
                key={prod._id}
                className="bg-white rounded-xl border border-gray-150 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group p-3 relative"
              >
                {/* Badge top-left */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded text-white ${
                      isRedBadge ? 'bg-[#801414]' : 'bg-[#1B5E20]'
                    }`}
                  >
                    {prod.badge.label}
                  </span>
                </div>

                {/* Image Container with Universal Auto-Fit */}
                <Link
                  href={`/product/${prod.slug}`}
                  className="w-full h-32 sm:h-36 flex items-center justify-center overflow-hidden rounded-lg bg-[#FAF9F6] p-2"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="max-h-full max-w-full w-auto h-auto object-contain object-center group-hover:scale-106 transition-transform duration-300 drop-shadow-xs"
                    loading="lazy"
                  />
                </Link>

                {/* Details */}
                <div className="pt-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/product/${prod.slug}`}
                      className="text-xs font-bold text-gray-900 hover:text-[#801414] transition-colors line-clamp-1 block"
                    >
                      {prod.name}
                    </Link>
                    <p className="text-[10px] text-gray-500 line-clamp-1">
                      {prod.description}
                    </p>
                  </div>

                  {/* Price & Rating */}
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-black text-[#801414]">
                      ${prod.price.toFixed(2)}
                    </p>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        ({prod.reviewsCount})
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Outlined Button */}
                  <div className="pt-2">
                    <button
                      onClick={(e) => handleAddToCart(e, prod)}
                      className="w-full py-1.5 px-2 border border-[#801414] text-[#801414] hover:bg-[#801414] hover:text-white transition-all rounded-md text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Add to Cart</span>
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
