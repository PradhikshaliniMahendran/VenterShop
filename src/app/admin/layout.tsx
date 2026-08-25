import React, { Suspense } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard - VENTERSHOP',
  description: 'Manage products, orders, customers, vouchers, and storefront configurations.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#F8F9FA] text-[#333333] font-sans antialiased overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-10 bg-[#F8F9FA]">
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
