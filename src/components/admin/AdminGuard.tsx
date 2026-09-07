'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const isLoginPage = pathname === '/admin/login';

  // If user is on /admin/login page, allow direct rendering
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#101A2D] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Verifying Administrator Access...</p>
      </div>
    );
  }

  // Not an admin: Block access immediately
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');

  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-[#101A2D] text-white flex flex-col items-center justify-center p-6 font-sans select-none">
        <div className="w-full max-w-md bg-[#1A2A4A] border border-red-500/30 p-8 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/20 text-[#E53935] rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-black tracking-tight text-white uppercase">Access Denied</h2>
            <p className="text-xs text-gray-300 leading-relaxed font-semibold">
              You do not have Administrator permissions to access the Control Panel.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/admin/login"
              className="w-full py-3 bg-[#E53935] hover:bg-[#c62828] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md block text-center"
            >
              Sign In as Administrator
            </Link>
            <Link
              href="/"
              className="w-full py-3 bg-white/10 hover:bg-white/15 text-gray-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Store</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin: Render full layout
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#F8F9FA] text-[#333333] font-sans antialiased overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-10 bg-[#F8F9FA]">
        {children}
      </main>
    </div>
  );
}
