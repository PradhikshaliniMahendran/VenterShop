'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import { SlidersHorizontal, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';

interface ICategoryData {
  _id: string;
  name: string;
  slug: string;
}

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
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  wholesaleMinQty?: number;
}

export default function ShopContent() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [products, setProducts] = useState<IProductData[]>([]);
  const [categories, setCategories] = useState<ICategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // 1. Fetch categories list on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories);
        }
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    }
    fetchCategories();
  }, []);

  // 2. Parse search params on change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('q') || '');
    setMinPriceInput(searchParams.get('minPrice') || '');
    setMaxPriceInput(searchParams.get('maxPrice') || '');
    setInStockOnly(searchParams.get('inStock') === 'true');
    setSortOption(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // 3. Helper to update search params and push URL
  const updateParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === '') {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    },
    [searchParams, pathname, router]
  );

  // 4. Fetch Products matching active URL params
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const urlParams = new URLSearchParams(Array.from(searchParams.entries())).toString();
        const res = await fetch(`/api/products?${urlParams}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error('Error loading products:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [searchParams]);

  // Handle Form Submissions for Filters
  const handleApplyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({
      minPrice: minPriceInput || null,
      maxPrice: maxPriceInput || null,
    });
  };

  const handleToggleStock = (checked: boolean) => {
    setInStockOnly(checked);
    updateParams({ inStock: checked ? 'true' : null });
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    updateParams({ category: slug === 'all' ? null : slug });
    setMobileFiltersOpen(false);
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
    updateParams({ sort: sort === 'newest' ? null : sort });
  };

  const handleResetFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setInStockOnly(false);
    setSelectedCategory('all');
    setSortOption('newest');
    router.push(pathname);
    setMobileFiltersOpen(false);
  };

  const getLocalizedCategoryName = (cat: ICategoryData) => {
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

  const getVirtualShopName = (slug: string) => {
    switch (slug) {
      case 'groceries':
        return language === 'ta' ? '🛒 வர்ச்சுவல் சூப்பர் மார்க்கெட்' : '🛒 Virtual Supermarket';
      case 'footwear':
      case 'shoes':
        return language === 'ta' ? '👟 வர்ச்சுவல் ஷூ ஷாப்' : '👟 Virtual Shoe Shop';
      case 'books':
        return language === 'ta' ? '📚 வர்ச்சுவல் புக் ஷாப்' : '📚 Virtual Book Shop';
      case 'computers':
        return language === 'ta' ? '💻 வர்ச்சுவல் கணினி மையம்' : '💻 Virtual Computer Center';
      case 'phones':
      case 'mobiles':
        return language === 'ta' ? '📱 வர்ச்சுவல் போன் ஷாப்' : '📱 Virtual Phone Shop';
      case 'clothing':
      case 'fashion':
        return language === 'ta' ? '👕 வர்ச்சுவல் ஃபேஷன் ஸ்டோர்' : '👕 Virtual Fashion Store';
      case 'electronics':
        return language === 'ta' ? '📺 வர்ச்சுவல் எலக்ட்ரானிக்ஸ் ஷாப்' : '📺 Virtual Electronics Shop';
      case 'animal-feed':
        return language === 'ta' ? '🌾 ராணி கால்நடை தீவனம்' : '🌾 Rani Animal Feed';
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Active Virtual Shop Banner Header */}
      {selectedCategory !== 'all' && getVirtualShopName(selectedCategory) && (
        <div className="mb-6 bg-gradient-to-r from-[#801414] via-[#991B1B] to-[#700000] text-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-red-900/30">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
              {language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட வர்ச்சுவல் கடை' : 'SELECTED VIRTUAL SHOP'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-0.5">{getVirtualShopName(selectedCategory)}</h1>
            <p className="text-xs text-red-100/90 mt-1 font-semibold">
              {language === 'ta' ? 'இந்த கடையில் உள்ள அனைத்து பிரத்யேக பொருட்களையும் பார்வையிடுகிறீர்கள்.' : 'Browsing products exclusively available in this virtual shop outlet.'}
            </p>
          </div>
          <button
            onClick={() => handleCategorySelect('all')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer"
          >
            {language === 'ta' ? 'அனைத்து கடைகளும்' : 'View All Shops'}
          </button>
        </div>
      )}

      {/* Active Special Offers Banner Header */}
      {searchParams.get('offers') === 'true' && (
        <div className="mb-6 bg-gradient-to-r from-[#7D0000] via-[#901414] to-[#6A0000] text-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-red-900/30">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-300 block">
              🔥 {language === 'ta' ? 'சிறப்பு சலுகைகள்' : 'SPECIAL OFFERS & PROMOTIONS'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-0.5">
              {language === 'ta' ? 'சிறப்பு சலுகைகள் & தள்ளுபடி பொருட்கள்' : 'Special Offers & Exclusive Deals'}
            </h1>
            <p className="text-xs text-red-100/90 mt-1 font-semibold">
              {language === 'ta' ? 'அனைத்து சிறப்பு சலுகைகள் மற்றும் தள்ளுபடி தயாரிப்புகளை பார்வையிடுகிறீர்கள்.' : 'Browsing all promotional deals, vouchers, and discounted products across VenterShop.'}
            </p>
          </div>
          <button
            onClick={() => router.push('/shop')}
            className="px-4 py-2 bg-white text-[#801414] hover:bg-yellow-300 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer shadow-sm"
          >
            {language === 'ta' ? 'அனைத்து பொருட்களும்' : 'All Products'}
          </button>
        </div>
      )}

      {/* Search Header Banner */}
      {searchQuery && (
        <div className="mb-6 bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-baseline gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Search results for:</span>
          <span className="text-lg font-black text-[#1A2A4A]">"{searchQuery}"</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: SIDEBAR FILTERS (Hidden on small screens) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          
          {/* Categories Filter Block */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider border-b border-gray-100 pb-2">
              {language === 'ta' ? 'வகைகள்' : 'Categories'}
            </h3>
            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`text-left text-sm py-1.5 px-2.5 rounded-lg transition-colors font-semibold ${
                  selectedCategory === 'all'
                    ? 'bg-[#1A2A4A] text-white'
                    : 'text-[#333333] hover:bg-gray-100'
                }`}
              >
                {language === 'ta' ? 'அனைத்து தயாரிப்புகள்' : 'All Products'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`text-left text-sm py-1.5 px-2.5 rounded-lg transition-colors font-semibold ${
                    selectedCategory === cat.slug
                      ? 'bg-[#1A2A4A] text-white'
                      : 'text-[#333333] hover:bg-gray-100'
                  }`}
                >
                  {getLocalizedCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter Block */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider border-b border-gray-100 pb-2">
              {language === 'ta' ? 'விலை வரம்பு (LKR)' : 'Price Range (LKR)'}
            </h3>
            <form onSubmit={handleApplyPriceFilter} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-1/2 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-[#1A2A4A] outline-none transition-colors text-gray-900 font-bold"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-1/2 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-[#1A2A4A] outline-none transition-colors text-gray-900 font-bold"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#1A2A4A] hover:bg-[#101A2D] text-white font-bold text-xs rounded-md shadow-xs transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'வடிகட்டு' : 'Apply Price'}</span>
              </button>
            </form>
          </div>

          {/* Availability Block */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider border-b border-gray-100 pb-2">
              {language === 'ta' ? 'கிடைக்கும் தன்மை' : 'Availability'}
            </h3>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#333333] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => handleToggleStock(e.target.checked)}
                className="w-4 h-4 accent-[#1A2A4A] border-gray-300 rounded-sm focus:ring-[#1A2A4A]"
              />
              <span>{language === 'ta' ? 'இருப்பில் உள்ளவை மட்டும்' : 'In Stock Only'}</span>
            </label>
          </div>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-gray-300 hover:bg-gray-50 text-[#333333] hover:text-[#000000] font-bold text-xs rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'வடிகட்டல்களை நீக்கு' : 'Reset All Filters'}</span>
          </button>
        </aside>

        {/* Right Column: PRODUCT CONTROLS AND GRID */}
        <div className="flex-1 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-500 font-bold">
              {loading ? (
                <span className="inline-block w-20 h-4 bg-gray-100 animate-pulse rounded-sm" />
              ) : (
                <span>
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1 py-1.5 px-3 border border-gray-200 hover:bg-gray-50 text-[#1A2A4A] rounded-lg text-xs font-semibold transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sorting Select */}
              <div className="flex items-center gap-1 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 hidden sm:inline-block" />
                <select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-[#F5F5F5] border border-transparent rounded-lg py-1.5 px-3 font-semibold text-xs text-[#333333] focus:bg-white focus:border-[#1A2A4A] outline-none transition-all cursor-pointer"
                >
                  <option value="newest">{language === 'ta' ? 'புதியவை' : 'Newest'}</option>
                  <option value="bestselling">{language === 'ta' ? 'அதிகம் விற்கப்படுபவை' : 'Best Selling'}</option>
                  <option value="popular">{language === 'ta' ? 'பிரபலமானவை' : 'Popularity'}</option>
                  <option value="price-asc">{language === 'ta' ? 'விலை: குறைந்ததிலிருந்து' : 'Price: Low to High'}</option>
                  <option value="price-desc">{language === 'ta' ? 'விலை: உயர்ந்ததிலிருந்து' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid / Loader / Empty State */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-96 shadow-sm border border-gray-100 flex flex-col p-4 space-y-4">
                  <div className="flex-1 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-5 w-2/3 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-9 w-full bg-gray-200 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-150 p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[#101A2D]">No products found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                We couldn't find any products matching your active filter criteria. Try resetting or adjusting your parameters.
              </p>
              <button
                onClick={handleResetFilters}
                className="py-2 px-6 bg-[#1A2A4A] hover:bg-[#101A2D] text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE FILTER PANEL */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-2xl z-50 p-6 flex flex-col overflow-y-auto space-y-6 shadow-2xl animate-slide-in-bottom">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#1A2A4A]">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full font-bold text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-[#101A2D] uppercase tracking-wide">Categories</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`py-1.5 px-3.5 rounded-full text-xs font-semibold border ${
                    selectedCategory === 'all'
                      ? 'bg-[#1A2A4A] text-white border-[#1A2A4A]'
                      : 'bg-white text-gray-600 border-gray-250 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`py-1.5 px-3.5 rounded-full text-xs font-semibold border ${
                      selectedCategory === cat.slug
                        ? 'bg-[#1A2A4A] text-white border-[#1A2A4A]'
                        : 'bg-white text-gray-600 border-gray-250 hover:bg-gray-50'
                    }`}
                  >
                    {getLocalizedCategoryName(cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-[#101A2D] uppercase tracking-wide">Price Range</h4>
              <form onSubmit={handleApplyPriceFilter} className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-1/3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-bold"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-1/3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-bold"
                />
                <button
                  type="submit"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-2 bg-[#1A2A4A] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Apply
                </button>
              </form>
            </div>

            {/* Mobile Availability */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-[#101A2D] uppercase tracking-wide">Availability</h4>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#333333] cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => handleToggleStock(e.target.checked)}
                  className="w-4 h-4 accent-[#1A2A4A]"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 border border-gray-250 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-[#1A2A4A] text-white font-bold text-xs rounded-lg"
              >
                See Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
