import React, { Suspense } from 'react';
import ShopContent from '@/components/storefront/ShopContent';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Shop - VENTERSHOP',
  description: 'Browse groceries, animal feed, books, electronics, daily needs, and other premium products.',
};

export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto py-12 px-4 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#1A2A4A] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 mt-2">Loading catalog...</p>
            </div>
          }
        >
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
