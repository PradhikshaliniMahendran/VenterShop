import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartContentClient from '@/components/cart/CartContentClient';

export const metadata = {
  title: 'Your Cart - VENTERSHOP',
  description: 'View your selected products, apply voucher codes, and check out.',
};

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="flex-grow py-8">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto py-12 px-4 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#1A2A4A] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 mt-2">Loading your cart...</p>
            </div>
          }
        >
          <CartContentClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
