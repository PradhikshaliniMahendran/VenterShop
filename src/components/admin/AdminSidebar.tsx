'use client';

import React from 'react';
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
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logoutUser } = useAuth();

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
    <aside className="w-64 shrink-0 bg-[#1A2A4A] text-white flex flex-col justify-between border-r border-[#101A2D] max-h-screen sticky top-0">
      {/* Brand Header */}
      <div>
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
  );
}
