import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/storefront/Hero';
import CategoryShowcase from '@/components/storefront/CategoryShowcase';
import FeaturedDeals from '@/components/storefront/FeaturedDeals';
import CommunityShowcase from '@/components/storefront/CommunityShowcase';
import TestimonialsSection from '@/components/storefront/TestimonialsSection';
import TrustSection from '@/components/storefront/TrustSection';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'VENTERSHOP - Premium Multi-Category E-Commerce Canada',
  description: 'Your Trusted Online Store for Quality Products, serving customers across Canada with bilingual support.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-[#F5F5F5] font-sans antialiased text-xs font-semibold">
      {/* Navigation Header */}
      <Suspense fallback={<div className="h-20 bg-white border-b border-gray-100" />}>
        <Header />
      </Suspense>

      {/* Hero Banner Section */}
      <Suspense fallback={<div className="h-[500px] bg-[#101A2D] animate-pulse" />}>
        <Hero />
      </Suspense>

      {/* Categories Grid Showcase */}
      <Suspense fallback={<div className="h-96 bg-[#071B5C] animate-pulse" />}>
        <CategoryShowcase />
      </Suspense>

      {/* Featured Products & Daily Deals Showcase */}
      <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
        <FeaturedDeals />
      </Suspense>

      {/* 1-Click Community Join & Customer Programs Showcase */}
      <Suspense fallback={<div className="h-96 bg-[#101A2D] animate-pulse" />}>
        <div id="community-section">
          <CommunityShowcase />
        </div>
      </Suspense>

      {/* Verified Customer Reviews & VIP Newsletter Banner */}
      <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
        <TestimonialsSection />
      </Suspense>

      {/* Trust & Features Propositions Section */}
      <Suspense fallback={<div className="h-64 bg-white animate-pulse" />}>
        <TrustSection />
      </Suspense>

      {/* Global Page Footer */}
      <Footer />
    </div>
  );
}
