import React, { Suspense } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';

export const metadata = {
  title: 'Admin Dashboard - VENTERSHOP',
  description: 'Manage products, orders, customers, vouchers, and storefront configurations.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <Suspense
        fallback={
          <div className="h-full w-full min-h-[400px] flex items-center justify-center">
            <div className="inline-block w-8 h-8 border-4 border-[#1A2A4A] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {children}
      </Suspense>
    </AdminGuard>
  );
}
