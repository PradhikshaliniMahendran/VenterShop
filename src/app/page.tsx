import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/storefront/Hero';
import DualFeatureCards from '@/components/storefront/DualFeatureCards';
import HowItWorks from '@/components/storefront/HowItWorks';
import ShopByCategory from '@/components/storefront/ShopByCategory';
import PromoBanners from '@/components/storefront/PromoBanners';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import WhyShopBanner from '@/components/storefront/WhyShopBanner';
import TrustBadges from '@/components/storefront/TrustBadges';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'VENTERSHOP - Your Trusted Online Store for Quality Products | Canada',
  description: 'Free Delivery on Orders over $75 across Canada. Premium Groceries, Rani Animal Feed, Books, Electronics, and Daily Essentials.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white font-sans antialiased text-xs font-semibold">
      {/* 1. Navigation Header */}
      <Suspense fallback={<div className="h-24 bg-white border-b border-gray-100" />}>
        <Header />
      </Suspense>

      {/* 2. Hero Banner Section + Location Strip */}
      <Suspense fallback={<div className="h-[450px] bg-[#FCFAF7] animate-pulse" />}>
        <Hero />
      </Suspense>

      {/* 3. Dual Category Showcase (Groceries & Rani Animal Feed) */}
      <Suspense fallback={<div className="h-72 bg-white animate-pulse" />}>
        <DualFeatureCards />
      </Suspense>

      {/* 4. How VenterShop Works (6-step Stepper Flow) */}
      <Suspense fallback={<div className="h-48 bg-gray-50 animate-pulse" />}>
        <HowItWorks />
      </Suspense>

      {/* 5. Shop By Category (8 Categories Grid) */}
      <Suspense fallback={<div className="h-48 bg-white animate-pulse" />}>
        <ShopByCategory />
      </Suspense>

      {/* 6. Secondary Promotional Banners */}
      <Suspense fallback={<div className="h-44 bg-white animate-pulse" />}>
        <PromoBanners />
      </Suspense>

      {/* 7. Featured Products (6 Items with badges & prices) */}
      <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
        <FeaturedProducts />
      </Suspense>

      {/* 8. Why Shop With VenterShop? Banner */}
      <Suspense fallback={<div className="h-40 bg-[#FFF8F0] animate-pulse" />}>
        <WhyShopBanner />
      </Suspense>

      {/* 9. 5-Column Trust Badges */}
      <Suspense fallback={<div className="h-28 bg-white animate-pulse" />}>
        <TrustBadges />
      </Suspense>

      {/* 10. Global Forest Green Footer */}
      <Footer />
    </div>
  );
}
