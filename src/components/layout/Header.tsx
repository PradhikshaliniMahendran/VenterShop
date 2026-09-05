'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Globe,
  Settings,
  LogOut,
  Headphones,
  Package,
  Home,
  ChevronDown,
  LayoutGrid,
  ShoppingBasket,
  BookOpen,
  Tv,
  Sparkles,
  HeartHandshake,
  Percent,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';

interface ICategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export default function Header() {
  const { t, language, setLanguage } = useTranslation();
  const { cartCount } = useCart();
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<ICategoryItem[]>([]);
  const catDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    }
    loadCategories();
  }, []);

  // Close categories dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const handleLogout = async () => {
    setAccountDropdownOpen(false);
    await logoutUser();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm text-xs font-semibold">
      
      {/* 1. TOP MAROON NOTIFICATION BAR */}
      <div className="w-full bg-[#801414] py-2 px-4 sm:px-8 text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs gap-1">
          <div className="flex items-center gap-2 text-white/95 font-medium">
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">🚚 Free Delivery</span>
            <span>Free Delivery on Orders over $75 | Fast & Reliable Shipping Across Canada</span>
          </div>
          <div className="flex items-center gap-4 text-white/90 text-xs">
            <Link href="/contact" className="hover:text-amber-200 transition-colors flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5" />
              <span>Help & Support</span>
            </Link>
            <span className="text-white/40">|</span>
            <Link href="/dashboard/orders" className="hover:text-amber-200 transition-colors flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
            <span className="text-white/40">|</span>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white transition-colors cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Scalable Nav, Search, Account, Cart) */}
      <div className="border-b border-gray-100 py-3 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <BrandLogo variant="dark" size="md" showSubtitle={true} />

          {/* Desktop Scalable Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-6 text-gray-700 font-semibold text-xs">
            {/* Home */}
            <Link
              href="/"
              className="flex items-center gap-1 text-[#801414] font-bold border-b-2 border-[#801414] pb-0.5"
            >
              <Home className="w-3.5 h-3.5 text-[#801414]" />
              <span>Home</span>
            </Link>

            {/* Scalable Categories Dropdown */}
            <div className="relative" ref={catDropdownRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md hover:text-[#801414] hover:bg-red-50/60 transition-all ${
                  categoriesDropdownOpen ? 'text-[#801414] bg-red-50/60' : ''
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#801414]" />
                <span className="font-bold">
                  {language === 'ta' ? 'வகைகள்' : 'Categories'}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Mega/Dropdown Menu */}
              {categoriesDropdownOpen && (
                <div
                  onMouseLeave={() => setCategoriesDropdownOpen(false)}
                  className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-gray-150 py-3 z-50 animate-fade-in"
                >
                  <div className="px-4 py-1.5 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      Browse All Categories
                    </span>
                    <Link
                      href="/shop"
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="text-[10px] font-bold text-[#801414] hover:underline"
                    >
                      View All →
                    </Link>
                  </div>

                  <div className="py-2 max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/shop?category=${cat.slug}`}
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50/60 hover:text-[#801414] transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-red-200">
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <ShoppingBasket className="w-4 h-4 text-gray-500 group-hover:text-[#801414]" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-gray-900 group-hover:text-[#801414]">{cat.name}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link
                          href="/shop?category=groceries"
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50/60 hover:text-[#801414]"
                        >
                          <ShoppingBasket className="w-4 h-4 text-[#1B5E20]" />
                          <span className="font-bold text-xs">Groceries & Provisions</span>
                        </Link>
                        <Link
                          href="/shop?category=animal-feed"
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50/60 hover:text-[#801414]"
                        >
                          <Sparkles className="w-4 h-4 text-[#D87A1E]" />
                          <span className="font-bold text-xs">Rani Animal Feed</span>
                        </Link>
                        <Link
                          href="/shop?category=books"
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50/60 hover:text-[#801414]"
                        >
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-xs">Literature & Books</span>
                        </Link>
                        <Link
                          href="/shop?category=electronics"
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50/60 hover:text-[#801414]"
                        >
                          <Tv className="w-4 h-4 text-purple-600" />
                          <span className="font-bold text-xs">Electronics & Gadgets</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shop All */}
            <Link
              href="/shop"
              className="hover:text-[#801414] transition-colors"
            >
              {language === 'ta' ? 'அனைத்து பொருட்கள்' : 'Shop'}
            </Link>

            {/* Deals / Offers */}
            <Link
              href="/shop?category=groceries"
              className="hover:text-[#801414] transition-colors flex items-center gap-1 text-[#801414] font-bold"
            >
              <Percent className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'சிறப்பு சலுகைகள்' : 'Offers'}</span>
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              className="hover:text-[#801414] transition-colors"
            >
              {language === 'ta' ? 'எங்களைப் பற்றி' : 'About Us'}
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className="hover:text-[#801414] transition-colors"
            >
              {language === 'ta' ? 'தொடர்பு' : 'Contact'}
            </Link>
          </nav>

          {/* Right Side: Search + Account + Cart */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex relative items-center w-52 xl:w-64"
            >
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F5F5] text-gray-800 text-xs pl-3 pr-8 py-2 rounded-full border border-gray-250 focus:border-[#801414] focus:bg-white outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2.5 text-gray-400 hover:text-[#801414] cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Account / User Menu */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex flex-col items-center text-gray-700 hover:text-[#801414] transition-colors px-1 cursor-pointer"
                  >
                    <User className="w-5 h-5 text-gray-700" />
                    <span className="text-[10px] font-bold truncate max-w-[60px]">
                      {user.firstName || 'Account'}
                    </span>
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-xs font-semibold">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-bold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] bg-red-50 text-[#801414] rounded-full font-bold">
                          {user.customerType || 'CUSTOMER'}
                        </span>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>My Orders</span>
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-red-700 hover:bg-red-50 font-bold"
                        >
                          <Settings className="w-4 h-4 text-red-600" />
                          <span>Admin Portal</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left border-t border-gray-100 mt-1 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex flex-col items-center text-gray-700 hover:text-[#801414] transition-colors px-1"
                >
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-[10px] font-bold">Account</span>
                </Link>
              )}
            </div>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-gray-700 hover:text-[#801414] transition-colors px-1"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1.5 -right-2 bg-[#801414] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <BrandLogo variant="dark" size="sm" showSubtitle={false} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mt-4 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 text-xs px-3 py-2.5 rounded-lg border border-gray-200 outline-none font-semibold"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Scalable Navigation Links */}
            <div className="flex flex-col gap-2 mt-5 text-xs font-bold">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#801414] flex items-center gap-2 py-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-800 py-2 border-b border-gray-50"
              >
                All Products
              </Link>

              {/* Collapsible Categories in Mobile */}
              <div className="py-2 border-b border-gray-50 space-y-2">
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Categories</p>
                <div className="pl-2 space-y-2">
                  {categories.map((c) => (
                    <Link
                      key={c._id}
                      href={`/shop?category=${c.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-gray-600 hover:text-[#801414] text-xs font-semibold py-1"
                    >
                      • {c.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 py-2 border-b border-gray-50"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 py-2"
              >
                Contact Us
              </Link>
            </div>

            {/* Language & Account */}
            <div className="mt-auto pt-6 border-t border-gray-100 space-y-3">
              <button
                onClick={toggleLanguage}
                className="w-full py-2 bg-gray-100 rounded-lg text-xs font-bold text-gray-800 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#801414]" />
                <span>Switch to {language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>
              {!user ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 bg-[#801414] text-white text-center rounded-lg text-xs font-bold"
                >
                  Sign In / Register
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-red-50 text-red-700 text-center rounded-lg text-xs font-bold cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
