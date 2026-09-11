'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VirtualShops from '@/components/storefront/VirtualShops';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Store,
  ShoppingBag,
  Footprints,
  BookOpen,
  Laptop,
  Smartphone,
  Shirt,
  Settings,
  MoreHorizontal,
  ArrowRight,
  Globe,
  Plane,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export default function VirtualShopsPage() {
  const { language } = useTranslation();
  const isTa = language === 'ta';

  const shopsList = [
    {
      id: 'supermarket',
      title: isTa ? 'வர்ச்சுவல் சூப்பர் மார்க்கெட்' : 'Virtual Supermarket',
      subtitle: isTa ? 'மளிகை & அன்றாட அத்தியாவசிய பொருட்கள்' : 'Groceries, Spices & Daily Essentials',
      desc: isTa
        ? 'இலங்கையின் பாரம்பரிய மசாலாக்கள், பொன்னி அரிசி, பருப்பு, எண்ணெய் மற்றும் அனைத்து மளிகைப் பொருட்களையும் ஒரே இடத்தில் பெறுங்கள்.'
        : 'Fresh groceries, authentic Ceylon spices, rice, pulses, and pantry essentials delivered direct to your doorstep.',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'நேரலை' : 'Live Now',
      badgeColor: 'bg-[#15793B] text-white',
      cardBg: 'bg-[#EEF7F2]',
      borderColor: 'border-[#C8E6D3]',
      iconBg: 'bg-[#15793B]',
      titleColor: 'text-[#15793B]',
      href: '/shop?category=groceries',
      isAvailable: true,
      features: isTa
        ? ['பிரெஷ் மளிகை பொருட்கள்', 'மலிவு விலை', 'வீட்டு வாசலில் டெலிவரி']
        : ['Fresh Produce & Spices', 'Competitive Pricing', 'Doorstep Delivery'],
    },
    {
      id: 'shoe-shop',
      title: isTa ? 'வர்ச்சுவல் ஷூ ஷாப்' : 'Virtual Shoe Shop',
      subtitle: isTa ? 'காலணிகள், செருப்புகள் & ஆக்சஸரீஸ்' : 'Footwear, Slippers & Accessories',
      desc: isTa
        ? 'ஆண்கள், பெண்கள் மற்றும் குழந்தைகளுக்கான நவீன காலணிகள், கேசுவல் செருப்புகள் மற்றும் அலுவலக ஷூக்கள்.'
        : 'Trending collection of casual shoes, formal footwear, sandals, and sports slippers for all age groups.',
      icon: Footprints,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#FCE8ED]',
      borderColor: 'border-[#F8D2DC]',
      iconBg: 'bg-[#E11D48]',
      titleColor: 'text-[#881337]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['சௌகரியமான வடிவமைப்பு', 'நீடித்து உழைக்கும் தரம்', 'பல்வேறு அளவுகள்']
        : ['Ergonomic Comfort', 'Durable Materials', 'All Sizes Available'],
    },
    {
      id: 'book-shop',
      title: isTa ? 'வர்ச்சுவல் புக் லேப்' : 'Virtual Book Lab',
      subtitle: isTa ? 'புத்தகங்கள் & கல்வி பொருட்கள்' : 'Books, Stationery & Educational',
      desc: isTa
        ? 'பள்ளி மற்றும் கல்லூரி புத்தகங்கள், நாவல்கள், தமிழ் இலக்கியங்கள், எழுதுபொருட்கள் மற்றும் கல்வி உபகரணங்கள்.'
        : 'Educational textbooks, stationery kits, Tamil & English literature, classic novels, and academic supplies.',
      icon: BookOpen,
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'நேரலை' : 'Live Now',
      badgeColor: 'bg-[#0D9488] text-white',
      cardBg: 'bg-[#E6F7F5]',
      borderColor: 'border-[#BCECE7]',
      iconBg: 'bg-[#0D9488]',
      titleColor: 'text-[#115E59]',
      href: '/shop?category=books-stationery',
      isAvailable: true,
      features: isTa
        ? ['தமிழ் & ஆங்கில புத்தகங்கள்', 'பள்ளி எழுதுபொருட்கள்', 'பல்க் ஆர்டர் தள்ளுபடி']
        : ['Tamil & English Titles', 'Quality Stationery', 'Bulk School Orders'],
    },
    {
      id: 'computer-shop',
      title: isTa ? 'வர்ச்சுவல் கம்ப்யூட்டர் சென்டர்' : 'Virtual Computer Center',
      subtitle: isTa ? 'கணினிகள், லேப்டாப்கள் & பாகங்கள்' : 'Computers, Laptops & Components',
      desc: isTa
        ? 'லேப்டாப்கள், டெஸ்க்டாப் கம்ப்யூட்டர்கள், விசைப்பலகை, மவுஸ், மானிட்டர்கள் மற்றும் கணினி பாகங்கள்.'
        : 'High-performance laptops, desktop systems, monitors, gaming accessories, and PC hardware components.',
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#F3E8FF]',
      borderColor: 'border-[#E9D5FF]',
      iconBg: 'bg-[#7C3AED]',
      titleColor: 'text-[#581C87]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['அங்கீகரிக்கப்பட்ட உத்தரவாதம்', 'நவீன மாடல்கள்', 'தொழில்நுட்ப உதவி']
        : ['Genuine Warranty', 'Latest Specifications', 'Tech Support'],
    },
    {
      id: 'mobile-shop',
      title: isTa ? 'வர்ச்சுவல் மொபைல் ஷாப்' : 'Virtual Phone Shop',
      subtitle: isTa ? 'ஸ்மார்ட்போன்கள் & ஆக்சஸரீஸ்' : 'Smartphones, Gadgets & Accessories',
      desc: isTa
        ? 'ஸ்மார்ட்போன்கள், ஹெட்போன்கள், பவர் பேங்க்கள், சார்ஜர்கள் மற்றும் மொபைல் கவர்கள்.'
        : 'Smartphones, wireless earbuds, smartwatches, power banks, and essential phone accessories.',
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#FEF3C7]',
      borderColor: 'border-[#FDE68A]',
      iconBg: 'bg-[#D97706]',
      titleColor: 'text-[#78350F]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['பிராண்டட் ஆக்சஸரீஸ்', 'வேகமான சார்ஜிங் தீர்வுகள்', 'நம்பகமான தரம்']
        : ['Branded Accessories', 'Fast Charging Kits', 'Verified Quality'],
    },
    {
      id: 'fashion-shop',
      title: isTa ? 'வர்ச்சுவல் ஆடை கடை' : 'Virtual Fashion Store',
      subtitle: isTa ? 'ஆடைகள், சேலைகள் & பேஷன்' : 'Clothing, Traditional & Modern Fashion',
      desc: isTa
        ? 'பாரம்பரிய பட்டுச் சேலைகள், குர்தாக்கள், டி-ஷர்ட்கள், ஜீன்ஸ் மற்றும் நவீன ஆடைகள்.'
        : 'Traditional silk sarees, ethnic wear, casual tees, denim, and trendy modern apparel collections.',
      icon: Shirt,
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#FAE8FF]',
      borderColor: 'border-[#F5D0FE]',
      iconBg: 'bg-[#C026D3]',
      titleColor: 'text-[#701A75]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['பாரம்பரிய & நவீன உடைகள்', 'பிரீமியம் துணி வகை', 'அனைத்து அளவுகள்']
        : ['Ethnic & Western Wear', 'Premium Fabrics', 'Complete Fit Range'],
    },
    {
      id: 'hardware-shop',
      title: isTa ? 'வர்ச்சுவல் எலக்ட்ரானிக்ஸ் & ஹார்ட்வேர்' : 'Virtual Electronics & Hardware',
      subtitle: isTa ? 'கருவிகள், உபகரணங்கள் & எலக்ட்ரானிக்ஸ்' : 'Appliances, Tools & Hardware Supplies',
      desc: isTa
        ? 'வீட்டு பராமரிப்பு கருவிகள், எலக்ட்ரிக்கல் உதிரிபாகங்கள், பிளம்பிங் உபகரணங்கள் மற்றும் வீட்டு உபயோக பொருட்கள்.'
        : 'Home appliances, power tools, electrical fittings, plumbing gear, and building hardware essentials.',
      icon: Settings,
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#F3F4F6]',
      borderColor: 'border-[#E5E7EB]',
      iconBg: 'bg-[#4B5563]',
      titleColor: 'text-[#1F2937]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['உறுதியான கருவிகள்', 'பாதுகாப்பான உபகரணங்கள்', 'தொழில்துறை தரம்']
        : ['Heavy Duty Build', 'Safety Certified', 'Industrial Grade'],
    },
    {
      id: 'other-shops',
      title: isTa ? 'மேலும் கடைகள் விரைவில்' : 'More Shops Coming Soon',
      subtitle: isTa ? 'புதிய சிறப்பு கடைகள் விரைவில் இணையும்' : 'Specialty Categories & Brands',
      desc: isTa
        ? 'விரைவில் மேலும் பல பிரத்யேக வர்ச்சுவல் கடைகள் VENTERSHOP தளத்தில் இணைக்கப்படவுள்ளன.'
        : 'More exciting virtual shops and specialty partner brand stores will be launching soon.',
      icon: MoreHorizontal,
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
      badge: isTa ? 'விரைவில்' : 'Coming Soon',
      badgeColor: 'bg-gray-700 text-white',
      cardBg: 'bg-[#EDE9FE]',
      borderColor: 'border-[#DDD6FE]',
      iconBg: 'bg-[#6366F1]',
      titleColor: 'text-[#4338CA]',
      href: '#',
      isAvailable: false,
      features: isTa
        ? ['புதிய கடைகள்', 'சிறப்பு தயாரிப்புகள்', 'பிரத்யேக சலுகைகள்']
        : ['New Curated Shops', 'Exclusive Lines', 'Member Benefits'],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans antialiased text-xs font-semibold">
      {/* 1. Header */}
      <Suspense fallback={<div className="h-24 bg-white border-b border-gray-100" />}>
        <Header />
      </Suspense>

      {/* 2. Sub-Header Navigation Strip */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-black transition-colors">
              {isTa ? 'முகப்பு' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#801414] font-black">
              {isTa ? 'வர்ச்சுவல் கடைகள்' : 'Virtual Shops'}
            </span>
          </nav>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#801414] font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isTa ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'}</span>
          </Link>
        </div>
      </div>

      {/* 3. Hero Header Section */}
      <section className="bg-gradient-to-r from-[#1A2A4A] via-[#101A2D] to-[#0A1220] text-white py-12 sm:py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#801414]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-4 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-[11px] font-extrabold uppercase tracking-widest">
            <Store className="w-3.5 h-3.5" />
            <span>{isTa ? 'எங்களின் சிறப்பு வர்ச்சுவல் கடைகள்' : 'Specialized Virtual Marketplace'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight">
            {isTa
              ? 'ஒரே தளத்தில் பல்வேறு சிறப்பு கடைகள்'
              : 'Explore All Virtual Specialty Shops'}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-2xl leading-relaxed">
            {isTa
              ? 'சூப்பர் மார்க்கெட் மற்றும் புக் லேப் இப்போது நேரலையில் உள்ளது. பிற கடைகள் விரைவில் திறக்கப்படவுள்ளன.'
              : 'Virtual Supermarket and Virtual Book Lab are live for shopping now. Additional specialty shops are launching soon.'}
          </p>
        </div>
      </section>

      {/* 4. Shops Grid Showcase */}
      <main className="max-w-7xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shopsList.map((shop) => {
            const Icon = shop.icon;
            return (
              <div
                key={shop.id}
                className={`group ${shop.cardBg} border ${shop.borderColor} rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1`}
              >
                {/* Image & Floating Badge */}
                <div className="relative h-44 w-full overflow-hidden bg-white/50">
                  <img
                    src={shop.image}
                    alt={shop.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  
                  {/* Category Badge */}
                  <span className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm ${shop.badgeColor}`}>
                    {shop.badge}
                  </span>

                  {/* Circle Icon */}
                  <div className={`absolute bottom-3 right-3 w-10 h-10 rounded-2xl ${shop.iconBg} text-white flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className={`text-base font-black ${shop.titleColor} leading-snug`}>
                      {shop.title}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-700">
                      {shop.subtitle}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-3">
                      {shop.desc}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-1.5 pt-3 border-t border-black/5 text-[11px] text-gray-600">
                    {shop.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-4">
                    {shop.isAvailable ? (
                      <Link
                        href={shop.href}
                        className="w-full py-2.5 px-4 bg-[#15793B] hover:bg-[#0E5428] text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span>{isTa ? 'இப்போதே வாங்கு' : 'Shop Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <div
                        className="w-full py-2.5 px-4 bg-gray-200 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed select-none"
                      >
                        <span>{isTa ? 'விரைவில்' : 'Coming Soon'}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Direct Foreign Buyers & Export Gateway Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#003B95] via-[#0055D4] to-[#0A2540] p-6 sm:p-10 text-white shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-[10px] font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>{isTa ? 'சர்வதேச பல்க் ஏற்றுமதி' : 'International Bulk Supply'}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-serif font-black tracking-tight text-white">
                {isTa
                  ? 'வெளிநாட்டு இறக்குமதியாளர்கள் & மொத்த வியாபாரிகள்'
                  : 'Are You a Foreign Buyer or Wholesale Importer?'}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-100 font-medium leading-relaxed max-w-2xl">
                {isTa
                  ? 'இலங்கையிலிருந்து நேரடி மசாலாக்கள், தேயிலை, மளிகைப் பொருட்கள் மற்றும் ராணி கால்நடை தீவனங்களை பல்க் ஆர்டரில் இறக்குமதி செய்ய எங்கள் பிரத்யேக ஏற்றுமதி தளத்தைப் பார்வையிடுங்கள்.'
                  : 'Source bulk commercial containers (FCL/LCL) and priority air cargo direct from Sri Lankan manufacturers with certified documentation and FOB/CIF pricing.'}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href="/export"
                className="px-6 py-3.5 bg-[#E53935] hover:bg-[#c62828] text-white text-center rounded-xl font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{isTa ? 'ஏற்றுமதி தளம் செல்ல' : 'Visit Export Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl font-bold uppercase tracking-wider border border-white/20 transition-colors"
              >
                {isTa ? 'தொடர்பு கொள்ள' : 'Contact Support Desk'}
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
