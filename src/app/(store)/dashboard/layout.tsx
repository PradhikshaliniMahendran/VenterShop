import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export const metadata = {
  title: 'My Dashboard - VENTERSHOP',
  description: 'Manage your profile, shipping addresses, track orders, and view vouchers.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="flex-grow max-w-7xl w-full mx-auto py-4 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
          <DashboardSidebar />
          <div className="flex-grow w-full lg:max-w-4xl">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
