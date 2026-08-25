'use client';

import React, { useState } from 'react';
import { Star, Quote, CheckCircle, Mail, Send } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function TestimonialsSection() {
  const { language } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const reviews = [
    {
      name: 'Priya & Ramesh',
      location: 'Scarborough, Toronto',
      rating: 5,
      comment: language === 'ta'
        ? 'டொராண்டோ தமிழ் சமூகக் குழுவில் இணைந்த பிறகு மளிகைப் பொருட்களுக்கு அதிக தள்ளுபடி கிடைக்கிறது. பொருட்கள் அனைத்தும் மிகவும் புதியதாக உள்ளன!'
        : 'Joining the Toronto Tamil Community saved us so much on monthly grocery bills. Fresh produce delivered right to our door in Scarborough!',
      tier: 'Community Member',
    },
    {
      name: 'Michael Chen',
      location: 'Markham, Ontario',
      rating: 5,
      comment: language === 'ta'
        ? 'B2B மொத்தக் கொள்முதல் விலை மிகவும் சிறப்பானது. எனது உணவகத்திற்கான அத்தியாவசியப் பொருட்கள் குறித்த நேரத்தில் கிடைக்கின்றன.'
        : 'As a restaurant manager, the wholesale bulk pricing matrix and automated volume discounts make VenterShop our go-to supplier.',
      tier: 'Wholesale Buyer',
    },
    {
      name: 'Sarah Jenkins',
      location: 'Vancouver, BC',
      rating: 5,
      comment: language === 'ta'
        ? 'விலைப்பட்டியல் மிகவும் தெளிவாக உள்ளது. $75 மேல் இலவச டெலிவரி கிடைப்பது மிகவும் உதவியாக இருக்கிறது!'
        : 'Fast shipping to BC and unbeatable prices on specialty items. Free delivery threshold over $75 makes it a no-brainer.',
      tier: 'Verified Shopper',
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  return (
    <section className="py-16 bg-white border-t border-gray-150 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E53935] bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Real Customer Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#101A2D] uppercase tracking-tight">
            {language === 'ta' ? 'வாடிக்கையாளர்களின் கருத்துக்கள்' : 'Loved by Thousands Across Canada'}
          </h2>
          <p className="text-xs text-gray-500 font-semibold">
            See what our shoppers in Toronto, Vancouver, and Montreal have to say about VenterShop.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-gray-50/60 p-6 rounded-2xl border border-gray-150 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative"
            >
              <Quote className="w-8 h-8 text-gray-200 absolute top-4 right-4" />

              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-gray-700 font-semibold leading-relaxed relative z-10 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-[#101A2D]">{rev.name}</h4>
                  <span className="text-[10px] text-gray-400 font-bold block">{rev.location}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  {rev.tier}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter VIP Banner */}
        <div className="bg-[#1A2A4A] text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-[#101A2D] flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <span className="bg-[#E53935] text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-sm">
              EXCLUSIVE DEALS
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase">
              {language === 'ta' ? '10% தள்ளுபடி கூப்பனை உடனடியாகப் பெறுங்கள்!' : 'Get 10% Off Your First Order!'}
            </h3>
            <p className="text-xs text-gray-300 font-semibold leading-relaxed">
              Subscribe to our VIP newsletter for exclusive weekly discounts, new product arrivals, and member flash sales.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Thank you! Your 10% coupon code (WELCOME10) has been generated.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 min-w-[320px]">
                <div className="relative flex-grow">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white text-gray-900 font-bold rounded-xl outline-none text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="py-3 px-6 bg-[#E53935] hover:bg-[#c62828] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
