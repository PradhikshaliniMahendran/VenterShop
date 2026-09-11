'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Gift,
  GraduationCap,
  Home,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Copy,
  Check,
  ShoppingBag,
  Users,
  HelpCircle,
} from 'lucide-react';

export default function CommunityVouchersPage() {
  const { language } = useTranslation();
  const isTa = language === 'ta';

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const studentFeatures = isTa
    ? [
        'பாடப் புத்தகங்கள் மற்றும் குறிப்பேடுகள்',
        'எழுதுபொருட்கள் மற்றும் கல்வி உபகரணங்கள்',
        'பள்ளி பைகள் மற்றும் சீருடை பாகங்கள்',
        'மாணவர் கணினி மற்றும் மொபைல் பாகங்கள்',
      ]
    : [
        'Educational Textbooks & Study Guides',
        'Stationery Kits & Geometry Sets',
        'School Bags & Uniform Accessories',
        'Student PC & Learning Peripherals',
      ];

  const familyFeatures = isTa
    ? [
        'மாதாந்திர மளிகைப் பொதிகள் (அரிசி, பருப்பு, எண்ணெய்)',
        'அன்றாட வீட்டு அத்தியாவசிய தேவைகள்',
        'சமூக உறுப்பினர்களுக்கான மானிய விலை',
        'நேரடி வீட்டு விநியோக ஆதரவு',
      ]
    : [
        'Monthly Essential Grocery Hampers (Rice, Pulses, Oil)',
        'Daily Household Essentials & Hygiene Products',
        'Subsidized Pricing for Verified Community Members',
        'Direct Doorstep Delivery Logistics Support',
      ];

  const faqs = [
    {
      q: isTa ? 'மாணவர் பரிசு வவுச்சரை யார் பெறலாம்?' : 'Who is eligible for the Student Gift Voucher?',
      a: isTa
        ? 'V2CC கல்வி வங்கியால் அங்கீகரிக்கப்பட்ட மாணவர்கள் மற்றும் VENTERSHOP தளத்தில் கல்வித் திட்டத்தின் கீழ் பதிவு செய்த பயனர்கள் இந்த வவுச்சரைப் பயன்படுத்தி கல்விப் பொருட்களுக்கு சிறப்பு சலுகை பெறலாம்.'
        : 'Registered students affiliated with the V2CC Educating Bank System and general learners on VENTERSHOP can redeem this voucher for exclusive discounts on educational books and stationery.',
    },
    {
      q: isTa ? 'குடும்ப ஆதரவு வவுச்சர் எப்போது செயல்படும்?' : 'When will the Family Support Voucher be activated?',
      a: isTa
        ? 'TMSAP திட்டத்தின் கீழ் குடும்பங்களுக்கான சரிபார்ப்புப் பணிகள் நடைபெற்று வருகின்றன. விரைவில் இது நேரலையில் செயல்படுத்தப்பட்டு பயனர்களுக்கு அறிவிக்கப்படும்.'
        : 'The TMSAP Project of V2CC is currently in its community onboarding and verification stage. The voucher will be toggled ON shortly upon program rollout.',
    },
    {
      q: isTa ? 'வவுச்சரை செக்-அவுட் பக்கத்தில் எவ்வாறு பயன்படுத்துவது?' : 'How do I redeem my voucher code at checkout?',
      a: isTa
        ? 'நீங்கள் வாங்க விரும்பும் பொருட்களை கார்ட்டில் சேர்த்த பின், கார்ட் அல்லது செக்-அவுட் பக்கத்தில் உள்ள "Voucher Code" கட்டத்தில் வவுச்சர் குறியீட்டை உள்ளிட்டு தள்ளுபடியைப் பெறலாம்.'
        : 'Simply add your items to the Cart and enter the voucher code in the "Apply Voucher" box on the Cart or Checkout screen to automatically apply your subsidy discount.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFAF7] font-sans antialiased text-xs font-semibold">
      
      {/* 1. Header */}
      <Suspense fallback={<div className="h-24 bg-white border-b border-gray-100" />}>
        <Header />
      </Suspense>

      {/* 2. Breadcrumbs & Sub-Header Navigation */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-black transition-colors">
              {isTa ? 'முகப்பு' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#801414] font-black">
              {isTa ? 'சமூக பரிசு வவுச்சர்கள்' : 'Community Gift Vouchers'}
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
      <section className="bg-gradient-to-r from-[#7B0000] via-[#8D0606] to-[#5A0000] text-white py-12 sm:py-16 px-4 sm:px-8 relative overflow-hidden shadow-inner">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-4 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 text-[11px] font-extrabold uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5" />
            <span>{isTa ? 'சமூக மேம்பாட்டு ஆதரவு' : 'Community Support Initiative'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight">
            {isTa
              ? 'கல்வி மற்றும் சமூகப் பராமரிப்பு பரிசு வவுச்சர்கள்'
              : 'Community Gift Vouchers & Educational Care'}
          </h1>

          <p className="text-xs sm:text-sm text-red-100 font-medium max-w-3xl leading-relaxed">
            {isTa
              ? 'V2CC அமைப்பின் கல்வி வங்கி மற்றும் TMSAP திட்டத்தின் ஆதரவோடு, மாணவர்கள் மற்றும் குடும்பங்கள் தங்களுக்குத் தேவையான அத்தியாவசிய பொருட்களை குறைந்த விலையிலும் மானிய அடிப்படையிலும் பெற்றுக்கொள்ள இந்த வவுச்சர்கள் வழங்கப்படுகின்றன.'
              : 'Empowering students and families across Sri Lanka. Supported by the Educating Bank System of V2CC and the TMSAP Project, our community vouchers ensure essential access to educational tools and family care items.'}
          </p>
        </div>
      </section>

      {/* 4. Main Vouchers Showcase */}
      <main className="max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 🎓 CARD 1: Student Gift Voucher (ACTIVE / ON) */}
          <div id="student" className="bg-white rounded-3xl border-2 border-[#0066E6]/30 p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden scroll-mt-24">
            
            {/* Active Ribbon */}
            <div className="absolute top-0 right-0 bg-[#00A859] text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{isTa ? 'தற்போது செயலில் உள்ளது (ON)' : 'ACTIVE NOW (ON)'}</span>
            </div>

            <div className="space-y-4">
              {/* Header Icon + Title */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F1FD] text-[#0066E6] flex items-center justify-center shrink-0 shadow-md">
                  <GraduationCap className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="space-y-1 pr-16">
                  <h2 className="text-lg sm:text-2xl font-black text-[#003B7A] leading-tight">
                    {isTa ? 'மாணவர் பரிசு வவுச்சர்' : 'Student Gift Voucher'}
                  </h2>
                  <p className="text-xs text-gray-500 font-semibold">
                    Supported by <strong className="text-[#0055D4]">Educating Bank System of V2CC</strong>
                  </p>
                </div>
              </div>

              {/* Promo Code Box */}
              <div className="bg-[#F0F6FE] border border-[#BFDBFE] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold text-[#0055D4] uppercase tracking-wider block">
                    {isTa ? 'வவுச்சர் குறியீடு' : 'Promo Voucher Code'}
                  </span>
                  <p className="text-lg font-mono font-black text-gray-900 tracking-wider">
                    STUDENT-V2CC
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('STUDENT-V2CC')}
                  className="px-4 py-2 bg-white hover:bg-[#0066E6] text-[#0066E6] hover:text-white border border-[#0066E6]/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  {copiedCode === 'STUDENT-V2CC' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isTa ? 'நகலெடுக்கப்பட்டது!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isTa ? 'குறியீட்டை காப்பி செய்' : 'Copy Code'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  {isTa ? 'தகுதியான கல்விப் பொருட்கள்:' : 'Eligible Student Items & Benefits:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {studentFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop?category=books-stationery"
                className="flex-1 py-3 px-5 bg-[#0066E6] hover:bg-[#0052B8] text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isTa ? 'கல்விப் பொருட்களை வாங்க' : 'Shop Student Items'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/vouchers"
                className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                {isTa ? 'வாலட்டில் பார்க்க' : 'View in Wallet'}
              </Link>
            </div>

          </div>

          {/* 🏠 CARD 2: Family Support Voucher (UPCOMING / OFF) */}
          <div id="family" className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden scroll-mt-24">
            
            {/* Status Indicator */}
            <div className="absolute top-0 right-0 bg-gray-400 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider shadow-xs flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>{isTa ? 'விரைவில் தொடங்குகிறது (OFF)' : 'LAUNCHING SOON (OFF)'}</span>
            </div>

            <div className="space-y-4">
              {/* Header Icon + Title */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F8EE] text-[#0E703C] flex items-center justify-center shrink-0 shadow-md">
                  <Home className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="space-y-1 pr-16">
                  <h2 className="text-lg sm:text-2xl font-black text-[#0E703C] leading-tight">
                    {isTa ? 'குடும்ப ஆதரவு வவுச்சர்' : 'Family Support Voucher'}
                  </h2>
                  <p className="text-xs text-gray-500 font-semibold">
                    Supported by <strong className="text-[#0E703C]">TMSAP Project of V2CC</strong>
                  </p>
                </div>
              </div>

              {/* Status Note Box */}
              <div className="bg-[#F6FBF7] border border-[#C8E6D3] rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-extrabold text-[#0E703C] uppercase tracking-wider block">
                  {isTa ? 'திட்ட நிலை விபரம்' : 'Program Status Notice'}
                </span>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  {isTa
                    ? 'குடும்பங்களுக்கான பதிவு மற்றும் சரிபார்ப்புப் பணிகள் முடிவடைந்ததும், இந்த வவுச்சர் ஆன்லைனில் செயல்படுத்தப்படும்.'
                    : 'Community household onboarding and verification are in progress. This voucher program will be activated for enrolled member families shortly.'}
                </p>
              </div>

              {/* Scope Checklist */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  {isTa ? 'திட்டத்தின் நன்மைகள் & பொருட்கள்:' : 'Planned Scope & Grocery Support:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {familyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/community"
                className="flex-1 py-3 px-5 bg-gray-100 hover:bg-[#0E703C] hover:text-white text-gray-800 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>{isTa ? 'சமூகத்தில் இணைய விண்ணப்பிக்க' : 'Join Community Program'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="py-3 px-5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                {isTa ? 'தொடர்பு கொள்ள' : 'Contact Us'}
              </Link>
            </div>

          </div>

        </div>

        {/* 5. How to Redeem Steps Infographic */}
        <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-md space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-extrabold text-[#801414] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
              {isTa ? 'எளிய 3 வழிமுறைகள்' : 'Simple 3-Step Process'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              {isTa ? 'வவுச்சர்களை எவ்வாறு பயன்படுத்துவது?' : 'How to Use Your Community Vouchers'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#FCFAF7] border border-gray-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#801414] text-white flex items-center justify-center mx-auto font-black text-sm">
                1
              </div>
              <h4 className="text-sm font-black text-gray-900">{isTa ? 'பொருட்களைத் தேர்வு செய்க' : 'Select Eligible Items'}</h4>
              <p className="text-xs text-gray-500 font-medium">{isTa ? 'கல்விப் புத்தகங்கள் அல்லது அத்தியாவசிய பொருட்களை கார்ட்டில் சேர்க்கவும்.' : 'Browse our store and add eligible books, stationery or daily essentials to your cart.'}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCFAF7] border border-gray-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#801414] text-white flex items-center justify-center mx-auto font-black text-sm">
                2
              </div>
              <h4 className="text-sm font-black text-gray-900">{isTa ? 'வவுச்சரைப் பயன்படுத்துக' : 'Apply Voucher Code'}</h4>
              <p className="text-xs text-gray-500 font-medium">{isTa ? 'கார்ட் பக்கத்தில் STUDENT-V2CC போன்ற குறியீட்டை உள்ளிடவும்.' : 'Enter your voucher code during checkout to deduct the community subsidy from your bill.'}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCFAF7] border border-gray-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#801414] text-white flex items-center justify-center mx-auto font-black text-sm">
                3
              </div>
              <h4 className="text-sm font-black text-gray-900">{isTa ? 'வீட்டு வாசலில் பெறுக' : 'Doorstep Delivery'}</h4>
              <p className="text-xs text-gray-500 font-medium">{isTa ? 'பாதுகாப்பான முறையில் உங்கள் பொருட்கள் உங்கள் இருப்பிடத்திற்கே அனுப்பி வைக்கப்படும்.' : 'Enjoy secure order fulfillment and fast islandwide shipping direct to your home.'}</p>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-md space-y-6">
          <div className="flex items-center gap-2 text-[#801414]">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-base sm:text-lg font-black text-gray-900">
              {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions'}
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-1">
                <h4 className="text-xs sm:text-sm font-black text-gray-900">{faq.q}</h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
