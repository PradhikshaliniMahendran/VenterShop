'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  Globe,
  Settings,
  LogOut,
  MapPin,
  Phone,
  ChevronRight,
} from 'lucide-react';

export default function Header() {
  const { t, language, setLanguage } = useTranslation();
  const { cartCount } = useCart();
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // Initialize search input from URL query param
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

  const navItems = [
    { label: t('navHome'), href: '/' },
    { label: t('navShop'), href: '/shop' },
    { label: t('navGroceries'), href: '/shop?category=groceries' },
    { label: t('navAnimalFeed'), href: '/shop?category=animal-feed' },
    { label: t('navBooks'), href: '/shop?category=books' },
    { label: t('navElectronics'), href: '/shop?category=electronics' },
    { label: t('navDailyNeeds'), href: '/shop?category=daily-needs' },
    { label: language === 'ta' ? 'எங்களைப் பற்றி' : 'About Us', href: '/about' },
    { label: language === 'ta' ? 'தொடர்பு கொள்ள' : 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md text-xs font-semibold">
      
      {/* 1. TOP NAVY PROMOTIONAL BAR */}
      <div className="w-full bg-[#071B5C] py-2 px-4 text-white border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-blue-200 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              100 University Ave, Toronto, ON, Canada
            </span>
            <span className="text-white/80 font-medium">🕒 Mon - Sun: 8:00 AM - 10:00 PM</span>
          </div>
          <div className="flex items-center gap-6 font-bold">
            <a href="tel:+18005550199" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 text-white">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              +1 (800) 555-0199
            </a>
            <span className="text-emerald-400 font-semibold">{t('promoFreeDelivery')}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="border-b border-gray-100 py-3.5 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* Mobile Menu Toggle button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-[#071B5C] bg-gray-100 hover:bg-gray-200 rounded-xl md:hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform duration-300 transform hover:scale-102">
            <div className="relative rounded-full border-2 border-[#D4AF37] bg-white shadow-sm flex items-center justify-center shrink-0 w-11 h-11 p-1">
              <span className="font-serif text-[#071B5C] font-black text-lg select-none">VS</span>
            </div>
            <span className="text-xl font-serif font-black tracking-tight text-[#071B5C] select-none">
              VENTER<span className="text-[#D4AF37]">SHOP</span>
            </span>
          </Link>

          {/* Search Bar - Hidden on small screens */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg relative items-center"
          >
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F5F5] text-gray-900 font-bold pl-4 pr-10 py-2.5 rounded-full border border-transparent focus:bg-white focus:border-[#071B5C] outline-none text-xs transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-3.5 text-gray-500 hover:text-[#071B5C] p-0.5"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Utility Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Toggler */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#071B5C] hover:bg-gray-50 py-2 px-3.5 rounded-full border border-gray-250 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/dashboard/wishlist"
              className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 text-[#071B5C] transition-colors relative hidden sm:inline-block border border-gray-200"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
            </Link>

            {/* Shopping Cart Link wrapped in navy circle */}
            <Link
              href="/cart"
              className="p-2.5 rounded-full bg-[#071B5C] hover:bg-[#0d216d] text-white transition-all relative flex items-center justify-center shadow-md"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E53935] text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Profile button - Visible on Desktop, accessed via hamburger menu on mobile */}
            <div className="relative hidden md:block">
              {user ? (
                <>
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-1 p-0.5 hover:bg-gray-100 rounded-full transition-colors border border-gray-100"
                    aria-label="Account Settings"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#071B5C] text-white flex items-center justify-center font-bold text-xs border-2 border-[#D4AF37]">
                      {user.firstName[0]}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {accountDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setAccountDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 animate-fade-in-up">
                        <div className="px-4 py-2.5 border-b border-gray-100">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {user.customerType === 'ADMIN' ? 'Administrator' : t('dashWelcome')}
                          </p>
                          <p className="text-sm font-extrabold text-[#101A2D] truncate">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                        {user.customerType === 'ADMIN' ? (
                          <Link
                            href="/admin"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#333333] hover:bg-gray-50 font-bold transition-colors"
                          >
                            <Settings className="w-4 h-4 text-gray-500" />
                            Admin Console
                          </Link>
                        ) : (
                          <Link
                            href="/dashboard"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#333333] hover:bg-gray-50 font-bold transition-colors"
                          >
                            <User className="w-4 h-4 text-gray-500" />
                            {t('navAccount')}
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-650 hover:bg-red-50 font-bold text-left border-t border-gray-100 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('navLogout')}
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-[#071B5C] hover:bg-[#0d216d] text-white text-[11px] font-black uppercase tracking-wider transition-all shadow-md"
                >
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t('navLogin')}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar - Visible only on mobile below main header */}
      <div className="md:hidden border-b border-[#E5E7EB] py-3 px-4">
        <form onSubmit={handleSearchSubmit} className="relative items-center">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F5F5] text-gray-900 font-bold pl-4 pr-10 py-2 rounded-lg border border-transparent focus:bg-white focus:border-[#071B5C] outline-none text-xs transition-all duration-200"
          />
          <button
            type="submit"
            className="absolute right-3.5 top-2 text-gray-500 hover:text-[#071B5C] p-0.5"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. CATEGORY / NAVIGATION LINKS - Hidden on mobile */}
      <nav className="hidden md:block bg-[#F5F5F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-[#071B5C] hover:text-[#E53935] font-black uppercase tracking-widest text-xs transition-colors duration-150 relative py-1 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E53935] transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white flex flex-col h-full shadow-2xl animate-slide-in-left">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <span className="font-serif text-lg font-black text-[#071B5C]">
                VENTER<span className="text-[#D4AF37]">SHOP</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-black"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-[#071B5C] hover:text-[#E53935] hover:bg-gray-50 rounded-lg text-sm font-black uppercase tracking-wider transition-all"
                >
                  {item.label}
                </Link>
              ))}

              {/* ── Account Section ── */}
              <div className="border-t border-gray-150 mt-4 pt-4 space-y-2">
                {user ? (
                  <>
                    {/* Clickable Profile Card -> Go directly to Dashboard or Admin */}
                    <Link
                      href={user.customerType === 'ADMIN' ? '/admin' : '/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3.5 bg-gradient-to-r from-[#1A2A4A] to-[#071B5C] rounded-2xl text-white shadow-md hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-white text-[#071B5C] flex items-center justify-center font-black text-sm border-2 border-[#D4AF37] shrink-0">
                          {user.firstName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-white truncate group-hover:text-[#D4AF37] transition-colors">
                            {user.firstName} {user.lastName}
                          </p>
                          <span className="text-[10px] text-blue-200 block truncate font-medium">
                            {user.customerType === 'ADMIN' ? 'Admin Console →' : (language === 'ta' ? 'கணக்கு டாஷ்போர்டு →' : 'My Dashboard →')}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={() => { setMobileMenuOpen(false); logoutUser(); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-red-600 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-red-100"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('navLogout')}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 mx-2 py-3 bg-[#071B5C] hover:bg-[#0d216d] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-md"
                  >
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    {t('navLogin')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
