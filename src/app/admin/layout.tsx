import React, { Suspense } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard - VENTERSHOP',
  description: 'Manage products, orders, customers, vouchers, and storefront configurations.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8F9FA] text-[#333333] font-sans antialiased">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 overflow-y-auto max-h-screen">
        <Suspense
          fallback={
            <div className="h-full w-full min-h-[400px] flex items-center justify-center">
              <div className="inline-block w-8 h-8 border-4 border-[#1A2A4A] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </div>
  );
}
