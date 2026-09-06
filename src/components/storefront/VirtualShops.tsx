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
  Tv,
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
      cardBg: 'bg-[#EFF6FF]', // Soft Light Blue
      borderColor: 'border-blue-100 hover:border-blue-300',
      iconBg: 'bg-[#2563EB]', // Bright Blue
      textColor: 'text-[#1E40AF]',
      ctaColor: 'text-[#2563EB]',
      href: '/shop?category=groceries',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'shoe-shop',
      title: isTa ? 'வர்ச்சுவல் ஷூ ஷாப்' : 'Virtual Shoe Shop',
      desc: isTa ? 'காலணிகள், செருப்புகள் & ஆக்சஸரீஸ்' : 'Shoes, Slippers & Accessories',
      icon: Footprints,
      cardBg: 'bg-[#FDF2F8]', // Soft Pink
      borderColor: 'border-pink-100 hover:border-pink-300',
      iconBg: 'bg-[#EC4899]', // Bright Pink
      textColor: 'text-[#BE185D]',
      ctaColor: 'text-[#EC4899]',
      href: '/shop?category=footwear',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'book-shop',
      title: isTa ? 'வர்ச்சுவல் புக் ஷாப்' : 'Virtual Book Shop',
      desc: isTa ? 'புத்தகங்கள், எழுதுபொருட்கள் & கல்வி பொருட்கள்' : 'Books, Stationery & Educational Items',
      icon: BookOpen,
      cardBg: 'bg-[#F3E8FF]', // Soft Purple
      borderColor: 'border-purple-100 hover:border-purple-300',
      iconBg: 'bg-[#9333EA]', // Bright Purple
      textColor: 'text-[#6B21A8]',
      ctaColor: 'text-[#9333EA]',
      href: '/shop?category=books',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'computer-center',
      title: isTa ? 'வர்ச்சுவல் கணினி மையம்' : 'Virtual Computer Center',
      desc: isTa ? 'கணினிகள், லேப்டாப்கள் & சாதனங்கள்' : 'Computers, Laptops & Accessories',
      icon: Laptop,
      cardBg: 'bg-[#E0F2FE]', // Soft Cyan/Sky
      borderColor: 'border-sky-100 hover:border-sky-300',
      iconBg: 'bg-[#0284C7]', // Bright Sky Blue
      textColor: 'text-[#075985]',
      ctaColor: 'text-[#0284C7]',
      href: '/shop?category=computers',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'phone-shop',
      title: isTa ? 'வர்ச்சுவல் போன் ஷாப்' : 'Virtual Phone Shop',
      desc: isTa ? 'மொபைல் போன்கள் & ஆக்சஸரீஸ்' : 'Mobile Phones & Accessories',
      icon: Smartphone,
      cardBg: 'bg-[#ECFDF5]', // Soft Teal/Green
      borderColor: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-[#10B981]', // Bright Emerald
      textColor: 'text-[#065F46]',
      ctaColor: 'text-[#10B981]',
      href: '/shop?category=phones',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'fashion-store',
      title: isTa ? 'வர்ச்சுவல் ஃபேஷன் ஸ்டோர்' : 'Virtual Fashion Store',
      desc: isTa ? 'ஆடைகள், பேக்குகள் & ஃபேஷன்' : 'Clothing, Bags & Accessories',
      icon: Shirt,
      cardBg: 'bg-[#FFF1F2]', // Soft Rose
      borderColor: 'border-rose-100 hover:border-rose-300',
      iconBg: 'bg-[#F43F5E]', // Bright Rose/Red
      textColor: 'text-[#9F1239]',
      ctaColor: 'text-[#F43F5E]',
      href: '/shop?category=clothing',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'electronics-shop',
      title: isTa ? 'வர்ச்சுவல் எலக்ட்ரானிக்ஸ்' : 'Virtual Electronics Shop',
      desc: isTa ? 'வீட்டு உபயோக & மின்னணு பொருட்கள்' : 'Home Appliances & Electronics',
      icon: Tv,
      cardBg: 'bg-[#FEF3C7]', // Soft Amber
      borderColor: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-[#D97706]', // Bright Amber
      textColor: 'text-[#92400E]',
      ctaColor: 'text-[#D97706]',
      href: '/shop?category=electronics',
      buttonText: isTa ? 'இப்போதே வாங்கு' : 'Shop Now',
    },
    {
      id: 'more-shops',
      title: isTa ? 'மேலும் கடைகள் விரைவில்' : 'More Shops Coming Soon',
      desc: isTa ? 'காத்திருங்கள்!' : 'Stay Tuned!',
      icon: MoreHorizontal,
      cardBg: 'bg-[#EEF2FF]', // Soft Indigo
      borderColor: 'border-indigo-100 hover:border-indigo-300',
      iconBg: 'bg-[#4F46E5]', // Bright Indigo
      textColor: 'text-[#3730A3]',
      ctaColor: 'text-[#4F46E5]',
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
    <section className="py-10 sm:py-14 bg-[#FAF9F6] border-b border-gray-100 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1.5">
            <span className="text-xs font-black tracking-widest text-[#801414] uppercase block">
              {isTa ? 'எங்களின் பிற வர்ச்சுவல் கடைகள்' : 'OUR OTHER VIRTUAL SHOPS'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {isTa ? 'VENTERSHOP இல் மேலும் கடைகளை ஆராயுங்கள்' : 'Explore More Shops on VENTERSHOP'}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              {isTa ? 'பல்வேறு கடைகள், பல சாத்தியக்கூறுகள் - ஒரே தளத்தில்' : 'Different Shops, More Possibilities – All in One Platform'}
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-[#801414] hover:border-[#801414] shadow-xs transition-all duration-200 self-center sm:self-auto"
          >
            <span>{isTa ? 'அனைத்து கடைகளையும் காண்க' : 'View All Shops'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8 Virtual Shops Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {virtualShops.map((shop) => {
            const Icon = shop.icon;
            return (
              <Link
                key={shop.id}
                href={shop.href}
                className={`group relative ${shop.cardBg} border ${shop.borderColor} rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="space-y-3">
                  {/* Icon Circle */}
                  <div className={`w-12 h-12 rounded-full ${shop.iconBg} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-gray-900 group-hover:text-[#801414] transition-colors leading-snug">
                      {shop.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs font-medium text-gray-600 mt-1 leading-relaxed line-clamp-2">
                      {shop.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-1.5 text-xs font-bold transition-transform">
                  <span className={`${shop.ctaColor} group-hover:underline`}>
                    {shop.buttonText}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${shop.ctaColor} group-hover:translate-x-1 transition-transform`} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* VIRTUAL FOREIGN BUYERS BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#003B95] via-[#0052CC] to-[#0A66C2] p-6 sm:p-8 text-white overflow-hidden shadow-xl border border-blue-400/30">
          {/* Subtle Background Decorative Graphic */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-1/3 -top-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-cyan-200 text-[11px] font-black uppercase tracking-wider border border-white/20">
                <Globe className="w-3.5 h-3.5" />
                <span>{isTa ? 'வர்ச்சுவல் வெளிநாட்டு வாங்குவோர்' : 'VIRTUAL FOREIGN BUYERS'}</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                {isTa
                  ? 'சர்வதேச வாங்குபவர்களுக்கான இலங்கை தயாரிப்புகள்'
                  : 'Sri Lankan Products for International Buyers'}
              </h3>

              <p className="text-xs sm:text-sm font-medium text-blue-100">
                {isTa
                  ? 'இலங்கையின் உயர்தர பொருட்களை உலகளாவிய சந்தையுடன் இணைக்கிறது'
                  : 'Connecting Sri Lankan Quality Products to the Global Market'}
              </p>

              {/* Action Button & Bullets */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/shop?export=true"
                  className="px-6 py-3 rounded-xl bg-white text-[#003B95] hover:bg-blue-50 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
                >
                  <span>{isTa ? 'ஏற்றுமதி பொருட்களை ஆராயுங்கள்' : 'Explore Export Products'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* 4 Feature Points with Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                {exportPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Image Showcase */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col items-center text-center group">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
                  alt="Sri Lankan Export Products"
                  className="w-full h-44 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Tag */}
                <div className="absolute top-6 right-6 bg-white text-gray-900 px-3 py-1.5 rounded-full text-[10px] font-black shadow-lg flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-[#003B95]" />
                  <span>{isTa ? 'இலங்கை பொருட்கள் உலகிற்கு' : 'Sri Lankan Products to the World'}</span>
                </div>

                <div className="mt-3 text-left w-full">
                  <p className="text-xs font-bold text-white">Ceylon Tea, Spices, Handicrafts & More</p>
                  <p className="text-[10px] text-blue-200">Authentic Sri Lankan exports ready for global shipping.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
