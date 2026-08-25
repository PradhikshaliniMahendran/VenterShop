'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  const shopCategories = [
    { label: t('navGroceries'), href: '/shop?category=groceries' },
    { label: t('navAnimalFeed'), href: '/shop?category=animal-feed' },
    { label: t('navBooks'), href: '/shop?category=books' },
    { label: t('navElectronics'), href: '/shop?category=electronics' },
    { label: t('navDailyNeeds'), href: '/shop?category=daily-needs' },
  ];

  const infoLinks = [
    { label: t('trustItem1Title'), href: '/about' },
    { label: 'Wholesale B2B Program', href: '/wholesale' },
    { label: 'Communities Program', href: '/communities' },
    { label: 'Sitemap', href: '/sitemap' },
  ];

  const serviceLinks = [
    { label: t('navContact'), href: '/contact' },
    { label: 'Shipping Information', href: '/shipping' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <footer className="bg-[#071B5C] text-gray-300 text-sm font-semibold">
      {/* 1. Value Proposition Banner */}
      <div className="bg-[#0c2461] border-b border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-white text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-3 bg-[#071B5C] rounded-full text-[#D4AF37]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base">Reliable Canada Shipping</h4>
              <p className="text-xs text-gray-300 font-medium">Fast and trackable logistics to all provinces.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-3 bg-[#071B5C] rounded-full text-[#D4AF37]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base">Hassle-Free Returns</h4>
              <p className="text-xs text-gray-300 font-medium">Unsatisfied? Return items within 14 days easily.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-3 bg-[#071B5C] rounded-full text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base">100% Secure Checkout</h4>
              <p className="text-xs text-gray-300 font-medium">Your transactional security is our top priority.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand Information */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-serif font-black tracking-tight text-white select-none">
              VENTER<span className="text-[#D4AF37]">SHOP</span>
            </span>
          </Link>
          <p className="text-xs text-gray-300 leading-relaxed font-medium">
            {t('footerSlogan')}
          </p>
          <div className="flex space-x-3 pt-2 text-[#D4AF37]">
            <a href="https://facebook.com" className="hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://twitter.com" className="hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://instagram.com" className="hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.752.054 1.14.052 1.662.242 2.074.403.546.213.986.514 1.396.924.41.41.711.85.924 1.396.161.412.35.933.403 2.074.045.968.054 1.324.054 3.752 0 2.43-.01 2.784-.054 3.752-.052 1.14-.242 1.662-.403 2.074-.213.546-.514.986-.924 1.396-.41.41-.85.711-1.396.924-.412.161-.933.35-2.074.403-.968.045-1.324.054-3.752.054-2.43 0-2.784-.01-3.752-.054-1.14-.052-1.662-.242-2.074-.403-.546-.213-.986-.514-1.396-.924-.41-.41-.711-.85-.924-1.396-.161-.412-.35-.933-.403-2.074-.045-.968-.054-1.324-.054-3.752 0-2.43.01-2.784.054-3.752.052-1.14.242-1.662.403-2.074.213-.546.514-.986.924-1.396.41-.41.85-.711 1.396-.924.412-.161.933-.35 2.074-.403.968-.045 1.324-.054 3.752-.054zM12 6.865A5.135 5.135 0 1017.135 12 5.135 5.135 0 0012 6.865zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Categories column */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">{t('footerQuickLinks')}</h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            {shopCategories.map((item, idx) => (
              <li key={idx}>
                <Link href={item.href} className="hover:text-[#D4AF37] hover:underline transition-all">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information column */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">{t('footerInformation')}</h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            {infoLinks.map((item, idx) => (
              <li key={idx}>
                <Link href={item.href} className="hover:text-[#D4AF37] hover:underline transition-all">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service column */}
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">{t('footerServices')}</h4>
            <ul className="space-y-2.5 text-xs font-semibold mb-4">
              {serviceLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-[#D4AF37] hover:underline transition-all">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Store contacts */}
          <div className="text-xs space-y-2 border-t border-white/5 pt-4">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>100 University Ave, Toronto, ON, Canada</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>+1 (800) 555-0199</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>info@ventershop.ca</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Bottom copyright bar */}
      <div className="border-t border-white/5 py-6 px-4 bg-[#05143a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>© 2026 VENTERSHOP Canada. {t('footerRights')}</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-[#D4AF37] transition-colors">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
