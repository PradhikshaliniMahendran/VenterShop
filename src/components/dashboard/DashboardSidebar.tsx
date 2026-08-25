'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Ticket,
  Heart,
  MapPin,
  Users,
  Briefcase,
  LogOut,
} from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { t, language } = useTranslation();
  const { user, logoutUser } = useAuth();

  const links = [
    { label: t('dashOverview'), href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: t('dashProfile'), href: '/dashboard/profile', icon: <User className="w-4 h-4" /> },
    { label: t('dashOrders'), href: '/dashboard/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: t('dashVouchers'), href: '/dashboard/vouchers', icon: <Ticket className="w-4 h-4" /> },
    { label: t('dashWishlist'), href: '/dashboard/wishlist', icon: <Heart className="w-4 h-4" /> },
    { label: t('dashAddresses'), href: '/dashboard/addresses', icon: <MapPin className="w-4 h-4" /> },
  ];

  // Dynamically append Community tab based on role context
  if (user && (user.customerType === 'COMMUNITY' || user.communityId)) {
    links.push({
      label: t('dashCommunity'),
      href: '/dashboard/community',
      icon: <Users className="w-4 h-4" />,
    });
  }

  // Always keep Wholesale tab accessible or highlight application status
  links.push({
    label: t('dashWholesale'),
    href: '/dashboard/wholesale',
    icon: <Briefcase className="w-4 h-4" />,
  });

  return (
    <>
      {/* ── MOBILE: Horizontal scrollable tab bar ── */}
      <div className="lg:hidden w-full bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden mb-4">
        {/* Mini profile strip */}
        {user && (
          <div className="px-4 py-3 bg-[#1A2A4A] text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white text-[#1A2A4A] flex items-center justify-center font-black text-sm select-none shrink-0">
              {user.firstName[0]}
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-xs truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-gray-300 font-medium truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Horizontal scroll nav */}
        <nav
          className="flex overflow-x-auto gap-1 p-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {links.map((link, idx) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={idx}
                href={link.href}
                className={`flex-shrink-0 flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-colors ${
                  isActive
                    ? 'bg-red-50 text-[#E53935]'
                    : 'text-[#333333] hover:bg-gray-50'
                }`}
              >
                {link.icon}
                <span className="whitespace-nowrap">{link.label}</span>
              </Link>
            );
          })}
          {/* Logout in tab bar too */}
          <button
            onClick={logoutUser}
            className="flex-shrink-0 flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wide text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="whitespace-nowrap">{t('navLogout')}</span>
          </button>
        </nav>
      </div>

      {/* ── DESKTOP: Full vertical sidebar ── */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden">
        {/* Profile Header */}
        {user && (
          <div className="p-6 border-b border-gray-100 bg-[#1A2A4A] text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#1A2A4A] flex items-center justify-center font-black text-base select-none">
              {user.firstName[0]}
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-gray-300 font-medium truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Nav Link List */}
        <nav className="p-4 space-y-1">
          {links.map((link, idx) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={idx}
                href={link.href}
                className={`flex items-center gap-3 py-2 px-3.5 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider ${
                  isActive
                    ? 'bg-red-50 text-[#E53935]'
                    : 'text-[#333333] hover:bg-gray-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-3 py-2 px-3.5 text-left rounded-lg text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2 pt-3"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('navLogout')}</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
