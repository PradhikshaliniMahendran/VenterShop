'use client';

import React, { useState, useEffect } from 'react';
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
  Percent,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';

export default function Header() {
  const { t, language, setLanguage } = useTranslation();
  const { cartCount } = useCart();
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

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

  const navLinks = [
    { label: language === 'ta' ? 'முகப்பு' : 'Home', href: '/', isHome: true },
    { label: language === 'ta' ? 'ஷாப்' : 'Shop', href: '/shop' },
    { label: language === 'ta' ? 'சலுகைகள்' : 'Offers', href: '/shop?offers=true', isOffer: true },
    { label: language === 'ta' ? 'எங்களைப் பற்றி' : 'About Us', href: '/about' },
    { label: language === 'ta' ? 'தொடர்பு கொள்ள' : 'Contact Us', href: '/contact' },
  ];

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

      {/* 2. MAIN HEADER (Logo, Clean Fixed Nav, Search, Account, Cart) */}
      <div className="border-b border-gray-100 py-3 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
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

          {/* Desktop Clean Fixed Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-gray-700 font-bold text-xs">
            {navLinks.map((item, idx) => {
              if (item.isHome) {
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-1.5 text-[#801414] font-black border-b-2 border-[#801414] pb-0.5"
                  >
                    <Home className="w-3.5 h-3.5 text-[#801414]" />
                    <span>{item.label}</span>
                  </Link>
                );
              }
              if (item.isOffer) {
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className="hover:text-[#801414] transition-colors flex items-center gap-1 text-[#801414]"
                  >
                    <Percent className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="hover:text-[#801414] transition-colors py-0.5"
                >
                  {item.label}
                </Link>
              );
            })}
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
                className="w-full bg-[#F5F5F5] text-gray-800 text-xs pl-3 pr-8 py-2 rounded-full border border-gray-250 focus:border-[#801414] focus:bg-white outline-none transition-all font-semibold"
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

            {/* Clean Fixed Navigation Links */}
            <div className="flex flex-col gap-2 mt-5 text-xs font-bold">
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2.5 border-b border-gray-50 flex items-center gap-2 ${
                    item.isHome ? 'text-[#801414]' : 'text-gray-800 hover:text-[#801414]'
                  }`}
                >
                  {item.isHome && <Home className="w-4 h-4" />}
                  {item.isOffer && <Percent className="w-4 h-4 text-[#801414]" />}
                  <span>{item.label}</span>
                </Link>
              ))}
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
