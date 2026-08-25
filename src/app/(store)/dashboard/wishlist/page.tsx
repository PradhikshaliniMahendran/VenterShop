'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';

interface IProductData {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  images: string[];
  retailPrice: number;
  communityPrice: number;
  wholesalePrice: number;
  stock: number;
  lowStockThreshold: number;
}

export default function DashboardWishlistPage() {
  const { t } = useTranslation();
  const { addToCart } = useCart();

  const [wishlistItems, setWishlistItems] = useState<IProductData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist items (using development products or from local state)
  useEffect(() => {
    async function loadMockWishlist() {
      try {
        // Fetch featured products to show as sample saved wishlist items
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Filter first two items as sample wishlist
          setWishlistItems(data.products.slice(0, 2) || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMockWishlist();
  }, []);

  const handleRemoveWish = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleMoveToCart = (item: IProductData) => {
    addToCart(item._id, 1);
    handleRemoveWish(item._id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-64 border border-gray-150 p-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <h1 className="text-xl font-black text-[#101A2D] tracking-tight uppercase border-b border-gray-150 pb-4">
        {t('dashWishlist')}
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-150 p-12 text-center text-xs text-gray-500 font-semibold max-w-md mx-auto">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          Your wishlist is empty. Add items from the shop to track them here.
          <Link
            href="/shop"
            className="block py-2 px-6 bg-[#1A2A4A] text-white rounded-lg font-bold mt-4 max-w-xs mx-auto hover:bg-[#101A2D]"
          >
            Go Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlistItems.map((product) => {
            const formattedPrice = new Intl.NumberFormat('en-CA', {
              style: 'currency',
              currency: 'CAD',
            }).format(product.retailPrice);

            return (
              <div
                key={product._id}
                className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-row items-center gap-4 relative group"
              >
                {/* Thumbnail */}
                <div
                  className="w-20 h-20 bg-cover bg-center bg-gray-50 rounded-lg border border-gray-150 shrink-0"
                  style={{ backgroundImage: `url('${product.images[0] || '/images/hero_banner.png'}')` }}
                />

                {/* Details */}
                <div className="flex-grow min-w-0 pr-4 space-y-1">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">SKU: {product.sku}</span>
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-bold text-[#101A2D] hover:text-[#E53935] text-sm leading-snug line-clamp-1 truncate transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm font-black text-[#1A2A4A]">{formattedPrice}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="p-2 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg shadow-xs transition-colors"
                    title="Move to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveWish(product._id)}
                    className="p-2 border border-gray-200 hover:bg-red-50 text-gray-400 hover:text-red-650 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
