'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Ticket,
  Settings,
  ArrowLeft,
  ShieldCheck,
  LogOut,
  Clock,
  Menu,
  X,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logoutUser } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const links = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Orders', href: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Products', href: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { label: 'Categories', href: '/admin/categories', icon: <Layers className="w-4 h-4" /> },
    { label: 'Communities', href: '/admin/communities', icon: <Users className="w-4 h-4" /> },
    { label: 'Customers', href: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    { label: 'Vouchers & Offers', href: '/admin/vouchers', icon: <Ticket className="w-4 h-4" /> },
    { label: 'Global Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'Audit Logs', href: '/admin/audit', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* ── MOBILE HEADER BAR (< lg) ── */}
      <header className="lg:hidden w-full bg-[#101A2D] text-white p-4 flex items-center justify-between border-b border-[#1A2A4A] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 bg-[#1A2A4A] hover:bg-[#24375d] rounded-xl text-white transition-colors"
            aria-label="Open admin menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E53935]" />
            <span className="font-black text-xs tracking-wider uppercase font-mono">VENTERSHOP ADMIN</span>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#1A2A4A] hover:bg-[#E53935] py-1.5 px-3 rounded-lg transition-colors text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Store</span>
        </Link>
      </header>

      {/* ── MOBILE DRAWER OVERLAY & PANEL (< lg) ── */}
      {mobileDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#1A2A4A] text-white flex flex-col justify-between shadow-2xl animate-slide-in-left lg:hidden">
            <div>
              {/* Drawer Top */}
              <div className="p-4 border-b border-[#101A2D] bg-[#101A2D] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#E53935]" />
                  <div>
                    <h2 className="font-black text-xs tracking-widest uppercase">VENTERSHOP</h2>
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase">CONTROL PANEL</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 hover:bg-[#1A2A4A] rounded-full text-gray-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card */}
              {user && (
                <div className="p-4 border-b border-[#101A2D] bg-[#1A2A4A]/50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white text-[#1A2A4A] flex items-center justify-center font-black text-sm">
                    {user.firstName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate leading-normal text-white">{user.firstName} {user.lastName}</p>
                    <span className="bg-red-500/20 text-[#FF8A80] text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider inline-block mt-0.5">
                      {user.role}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
                {links.map((link, idx) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={idx}
                      href={link.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                        isActive
                          ? 'bg-[#E53935] text-white shadow-xs'
                          : 'text-gray-300 hover:text-white hover:bg-[#101A2D]/40'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-[#101A2D] space-y-2 bg-[#101A2D]">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-[#1A2A4A] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit to Store</span>
              </Link>
              <button
                onClick={() => { setMobileDrawerOpen(false); logoutUser(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#FF8A80] hover:bg-red-500/20 transition-colors border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── DESKTOP SIDEBAR (lg+) ── */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#1A2A4A] text-white flex-col justify-between border-r border-[#101A2D] min-h-screen sticky top-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#101A2D] bg-[#101A2D] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#E53935]" />
            <div>
              <h1 className="font-black text-sm tracking-widest uppercase">VENTERSHOP</h1>
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">CONTROL PANEL</span>
            </div>
          </div>

          {/* User Card */}
          {user && (
            <div className="p-4 border-b border-[#101A2D] bg-[#1A2A4A]/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white text-[#1A2A4A] flex items-center justify-center font-black text-sm">
                {user.firstName[0]}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs truncate leading-normal">{user.firstName} {user.lastName}</p>
                <span className="bg-red-500/20 text-[#FF8A80] text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider block mt-0.5">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          {/* Menu Navigation */}
          <nav className="p-4 space-y-1">
            {links.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className={`flex items-center gap-3 py-2.5 px-4 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                    isActive
                      ? 'bg-[#E53935] text-white shadow-xs'
                      : 'text-gray-300 hover:text-white hover:bg-[#101A2D]/40'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-[#101A2D] space-y-1 bg-[#101A2D]/20">
          <Link
            href="/"
            className="flex items-center gap-3 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:bg-[#101A2D]/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit to Store</span>
          </Link>
          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-3 py-2 px-4 text-left rounded-lg text-xs font-bold uppercase tracking-wider text-[#FF8A80] hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
