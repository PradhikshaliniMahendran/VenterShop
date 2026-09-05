'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function Footer() {
  const { language } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const quickLinks = [
    { label: language === 'ta' ? 'ஷாப்' : 'Shop', href: '/shop' },
    { label: language === 'ta' ? 'மளிகை' : 'Groceries', href: '/shop?category=groceries' },
    { label: language === 'ta' ? 'கால்நடை தீவனம்' : 'Animal Feed', href: '/shop?category=animal-feed' },
    { label: language === 'ta' ? 'எங்களைப் பற்றி' : 'About Us', href: '/about' },
    { label: language === 'ta' ? 'தொடர்பு கொள்ள' : 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
  ];

  const customerService = [
    { label: language === 'ta' ? 'எனது ஆர்டர்கள்' : 'My Orders', href: '/dashboard/orders' },
    { label: language === 'ta' ? 'விநியோகம் & அனுப்புதல்' : 'Shipping & Delivery', href: '/shipping' },
    { label: language === 'ta' ? 'திரும்பப் பெறுதல்' : 'Returns & Refunds', href: '/returns' },
    { label: language === 'ta' ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy', href: '/privacy' },
    { label: language === 'ta' ? 'விதிமுறைகள் & நிபந்தனைகள்' : 'Terms & Conditions', href: '/terms' },
  ];

  return (
    <footer className="bg-[#0C2B16] text-gray-200 text-xs font-semibold">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Socials (Span 4) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div>
              <Link href="/" className="inline-block">
                <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white select-none">
                  VENTERSHOP
                </span>
              </Link>
              <p className="text-[11px] text-gray-300 font-normal leading-relaxed mt-1 max-w-sm">
                Your trusted online store for quality products. Serving homes across Canada.
              </p>
            </div>

            {/* Social Icons (FB, Instagram, WhatsApp, TikTok) */}
            <div className="flex items-center gap-2 pt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white hover:text-[#0C2B16] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white hover:text-[#0C2B16] text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/18005550199"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white hover:text-[#0C2B16] text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white hover:text-[#0C2B16] text-white flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.03 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.1 3.22-1.61 3.24-3.43.04-4.83.02-9.67.03-14.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-[11px] text-gray-300 font-medium">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Service (Span 3) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-2 text-[11px] text-gray-300 font-medium">
              {customerService.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Stay Updated & Payments (Span 3) */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Stay Updated</h4>
              <p className="text-[11px] text-gray-300 font-normal leading-relaxed">
                Subscribe to our newsletter and get exclusive offers and updates.
              </p>
              
              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} className="flex gap-1.5 pt-1">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white text-gray-900 px-3 py-1.5 rounded text-[11px] w-full outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#801414] hover:bg-[#630f0f] text-white px-3.5 py-1.5 rounded text-[11px] font-bold shrink-0 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="text-[10px] text-emerald-400 font-bold">Thank you for subscribing!</p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="pt-2 space-y-2">
              <h5 className="text-[11px] font-bold text-white uppercase tracking-wider">Payment Methods</h5>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-white text-blue-900 font-black px-1.5 py-0.5 rounded text-[9px]">VISA</span>
                <span className="bg-white text-red-600 font-black px-1.5 py-0.5 rounded text-[9px]">Mastercard</span>
                <span className="bg-white text-blue-600 font-black px-1.5 py-0.5 rounded text-[9px]">AMEX</span>
                <span className="bg-white text-yellow-600 font-black px-1.5 py-0.5 rounded text-[9px]">Interac</span>
                <span className="bg-white text-black font-black px-1.5 py-0.5 rounded text-[9px]">Pay</span>
                <span className="text-[9px] text-gray-400 font-normal">& more</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 text-center text-[10px] text-gray-400 font-normal">
          © 2024 VENTERSHOP. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
