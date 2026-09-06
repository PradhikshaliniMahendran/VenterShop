'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
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
  CheckCircle2,
  Plane,
} from 'lucide-react';

export default function VirtualShops() {
  const { language } = useTranslation();
  const isTa = language === 'ta';

  const virtualShops = [
    {
      id: 'supermarket',
      title: isTa ? 'வர்ச்சுவல் சூப்பர் மார்க்கெட்' : 'Virtual Supermarket',
      desc: isTa ? 'மளிகை & அன்றாட அத்தியாவசிய பொருட்கள்' : 'Groceries & Daily Essentials',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#EBF3FE]',
      borderColor: 'border-[#D0E2FF]',
      iconBg: 'bg-[#007AFF]',
      titleColor: 'text-[#004085]',
      descColor: 'text-[#4A607A]',
      ctaColor: 'text-[#007AFF]',
      href: '/shop?category=groceries',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'shoe-shop',
      title: isTa ? 'வர்ச்சுவல் ஷூ ஷாப்' : 'Virtual Shoe Shop',
      desc: isTa ? 'காலணிகள், செருப்புகள் & ஆக்சஸரீஸ்' : 'Shoes, Slippers & Accessories',
      icon: Footprints,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#FCE8ED]',
      borderColor: 'border-[#F8D2DC]',
      iconBg: 'bg-[#E11D48]',
      titleColor: 'text-[#881337]',
      descColor: 'text-[#7A4A56]',
      ctaColor: 'text-[#E11D48]',
      href: '/shop?category=footwear',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'book-shop',
      title: isTa ? 'வர்ச்சுவல் புக் ஷாப்' : 'Virtual Book Shop',
      desc: isTa ? 'புத்தகங்கள், எழுதுபொருட்கள் & கல்வி பொருட்கள்' : 'Books, Stationery & Educational Items',
      icon: BookOpen,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#F0E6FF]',
      borderColor: 'border-[#E0CCFF]',
      iconBg: 'bg-[#7C3AED]',
      titleColor: 'text-[#4C1D95]',
      descColor: 'text-[#5E4A7A]',
      ctaColor: 'text-[#7C3AED]',
      href: '/shop?category=books',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'computer-center',
      title: isTa ? 'வர்ச்சுவல் கணினி மையம்' : 'Virtual Computer Center',
      desc: isTa ? 'கணினிகள், லேப்டாப்கள் & சாதனங்கள்' : 'Computers, Laptops & Accessories',
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#E1F5FE]',
      borderColor: 'border-[#B3E5FC]',
      iconBg: 'bg-[#0284C7]',
      titleColor: 'text-[#0369A1]',
      descColor: 'text-[#4A6B7A]',
      ctaColor: 'text-[#0284C7]',
      href: '/shop?category=computers',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'phone-shop',
      title: isTa ? 'வர்ச்சுவல் போன் ஷாப்' : 'Virtual Phone Shop',
      desc: isTa ? 'மொபைல் போன்கள் & ஆக்சஸரீஸ்' : 'Mobile Phones & Accessories',
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#E6F4EA]',
      borderColor: 'border-[#CEEAD6]',
      iconBg: 'bg-[#0F9D58]',
      titleColor: 'text-[#137333]',
      descColor: 'text-[#4A7A5A]',
      ctaColor: 'text-[#0F9D58]',
      href: '/shop?category=phones',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'fashion-store',
      title: isTa ? 'வர்ச்சுவல் ஃபேஷன் ஸ்டோர்' : 'Virtual Fashion Store',
      desc: isTa ? 'ஆடைகள், பேக்குகள் & ஃபேஷன்' : 'Clothing, Bags & Accessories',
      icon: Shirt,
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#FFE4E6]',
      borderColor: 'border-[#FECDD3]',
      iconBg: 'bg-[#F43F5E]',
      titleColor: 'text-[#9F1239]',
      descColor: 'text-[#7A4A56]',
      ctaColor: 'text-[#F43F5E]',
      href: '/shop?category=clothing',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'electronics-shop',
      title: isTa ? 'வர்ச்சுவல் எலக்ட்ரானிக்ஸ்' : 'Virtual Electronics Shop',
      desc: isTa ? 'வீட்டு உபயோக & மின்னணு பொருட்கள்' : 'Home Appliances & Electronics',
      icon: Settings,
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#FFF8E1]',
      borderColor: 'border-[#FFE082]',
      iconBg: 'bg-[#D97706]',
      titleColor: 'text-[#B45309]',
      descColor: 'text-[#7A6B4A]',
      ctaColor: 'text-[#D97706]',
      href: '/shop?category=electronics',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'more-shops',
      title: isTa ? 'மேலும் கடைகள் விரைவில்' : 'More Shops Coming Soon',
      desc: isTa ? 'காத்திருங்கள்!' : 'Stay Tuned!',
      icon: MoreHorizontal,
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80',
      cardBg: 'bg-[#EDE9FE]',
      borderColor: 'border-[#DDD6FE]',
      iconBg: 'bg-[#6366F1]',
      titleColor: 'text-[#4338CA]',
      descColor: 'text-[#5E4A7A]',
      ctaColor: 'text-[#6366F1]',
      href: '/shop',
      buttonText: isTa ? 'மேலும் பார்க்க' : 'View More',
    },
  ];

  const exportPoints = isTa
    ? [
        'இலங்கை விநியோகஸ்தர்களிடமிருந்து நேரடியாக',
        'ஏற்றுமதிக்கு தயார்நிலையில் உள்ள பொருட்கள்',
        'மொத்த வியாபாரம் & பல்க் ஆர்டர்கள்',
        'உலகளாவிய ஷிப்பிங் ஆதரவு',
      ]
    : [
        'Direct from Sri Lankan Suppliers',
        'Export-Ready Products',
        'Wholesale & Bulk Orders',
        'Worldwide Shipping Support',
      ];

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="relative text-center space-y-1">
          <span className="text-[11px] font-extrabold tracking-wider text-[#990000] uppercase block">
            {isTa ? 'எங்களின் பிற வர்ச்சுவல் கடைகள்' : 'OUR OTHER VIRTUAL SHOPS'}
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            {isTa ? 'VENTERSHOP இல் மேலும் கடைகளை ஆராயுங்கள்' : 'Explore More Shops on VENTERSHOP'}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-500">
            {isTa ? 'பல்வேறு கடைகள், பல சாத்தியக்கூறுகள் - ஒரே தளத்தில்' : 'Different Shops, More Possibilities – All in One Platform'}
          </p>

          {/* Top Right "View All Shops" Button */}
          <div className="mt-3 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:text-[#990000] hover:border-[#990000] shadow-xs transition-all duration-200"
            >
              <span>{isTa ? 'அனைத்து கடைகளையும் காண்க' : 'View All Shops'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 8 Virtual Shops Grid with Product Images & Circle Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {virtualShops.map((shop) => {
            const Icon = shop.icon;
            return (
              <Link
                key={shop.id}
                href={shop.href}
                className={`group relative ${shop.cardBg} border ${shop.borderColor} rounded-2xl p-3 flex flex-col items-center text-center justify-between min-h-[220px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Top Image Showcase */}
                <div className="relative w-full h-20 rounded-xl overflow-hidden shadow-xs mb-2 bg-white/50">
                  <img
                    src={shop.image}
                    alt={shop.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Floating Icon Circle */}
                  <div className={`absolute bottom-1 right-1 w-7 h-7 rounded-full ${shop.iconBg} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="space-y-1 my-1">
                  <h3 className={`text-xs font-black ${shop.titleColor} leading-tight line-clamp-2`}>
                    {shop.title}
                  </h3>
                  <p className={`text-[10px] font-semibold ${shop.descColor} leading-tight line-clamp-2`}>
                    {shop.desc}
                  </p>
                </div>

                {/* Bottom Center CTA */}
                <div className="mt-auto pt-2 flex items-center justify-center gap-1 text-[11px] font-extrabold">
                  <span className={`${shop.ctaColor} group-hover:underline`}>
                    {shop.buttonText}
                  </span>
                  <ArrowRight className={`w-3 h-3 ${shop.ctaColor} group-hover:translate-x-0.5 transition-transform`} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* VIRTUAL FOREIGN BUYERS BANNER */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#D9EAFE] via-[#E8F1FD] to-[#D9EAFE] p-5 sm:p-7 text-gray-900 border border-blue-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Graphic + Content */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              
              {/* Giant Globe with Airplane Icon Badge */}
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0055D4] text-white flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-white/90" />
                <Plane className="w-5 h-5 text-cyan-300 absolute bottom-2 right-2 animate-bounce" />
              </div>

              {/* Text Info */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0055D4] block">
                  {isTa ? 'வர்ச்சுவல் வெளிநாட்டு வாங்குவோர்' : 'VIRTUAL FOREIGN BUYERS'}
                </span>

                <h3 className="text-lg sm:text-2xl font-black text-[#002B66] leading-tight">
                  {isTa
                    ? 'சர்வதேச வாங்குபவர்களுக்கான இலங்கை தயாரிப்புகள்'
                    : 'Sri Lankan Products for International Buyers'}
                </h3>

                <p className="text-xs font-semibold text-[#1A4578]">
                  {isTa
                    ? 'இலங்கையின் உயர்தர பொருட்களை உலகளாவிய சந்தையுடன் இணைக்கிறது'
                    : 'Connecting Sri Lankan Quality Products to the Global Market'}
                </p>

                {/* Explore Export Button & 4 Checklist Items */}
                <div className="pt-2 space-y-3">
                  <Link
                    href="/shop?export=true"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0055D4] hover:bg-[#0040A8] text-white font-black text-xs shadow-md hover:shadow-lg transition-all duration-200 group"
                  >
                    <span>{isTa ? 'ஏற்றுமதி பொருட்களை ஆராயுங்கள்' : 'Explore Export Products'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                    {exportPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] font-bold text-[#003B7A]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A859] flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Product Collage Visual */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xs bg-white p-3 rounded-2xl border border-blue-100 shadow-md flex flex-col items-center text-center group">
                <div className="relative w-full h-36 rounded-xl overflow-hidden">
                  <img
                    src="/images/sri_lankan_exports.jpg"
                    alt="Sri Lankan Export Products"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-[#002B66]/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1">
                    <Plane className="w-3 h-3 text-cyan-300" />
                    <span>Sri Lankan Products to the World</span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <p className="text-xs font-black text-gray-900">Discover Sri Lankan Products to the World</p>
                  <p className="text-[10px] text-gray-500 font-medium">Ceylon Tea, Spices, Handicrafts & Souvenirs</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
