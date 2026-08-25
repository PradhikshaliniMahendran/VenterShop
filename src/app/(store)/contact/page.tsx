'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

export default function ContactPage() {
  const { t, language } = useTranslation();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] text-xs font-semibold">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>

      <main className="flex-grow max-w-7xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page title banner */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-[0.3em] text-[#E53935] block">
            {language === 'ta' ? 'தொடர்பு கொள்ள' : 'GET IN TOUCH'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#1A2A4A] tracking-tight">
            {language === 'ta' ? 'எங்களை தொடர்பு கொள்ள' : 'Contact Us'}
          </h1>
          <div className="w-12 h-0.5 bg-[#E53935] mx-auto rounded-full" />
          <p className="text-sm text-gray-500 font-medium leading-relaxed pt-2">
            Have questions about orders, B2B wholesale applications, or community group discount vouchers? Send us a message and our support team will reply shortly.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Form Card */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <h2 className="text-base font-extrabold text-[#1A2A4A] uppercase tracking-wider border-b border-gray-100 pb-3">
              Send Message
            </h2>

            {success && (
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl font-extrabold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your message has been received. Our team will contact you soon.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#101A2D] font-bold block mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#101A2D] font-bold block mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#101A2D] font-bold block mb-1">Message Content *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto h-11 flex items-center justify-center gap-2 bg-[#1A2A4A] hover:bg-[#101A2D] text-white font-bold px-8 rounded-lg shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4 text-[#E53935]" />
                  <span>{submitting ? 'Sending Message...' : 'Submit Message'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Contact Details Cards */}
          <div className="space-y-6">
            
            {/* Info details card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              <h3 className="font-extrabold text-sm text-[#1A2A4A] uppercase tracking-wider border-b border-gray-100 pb-3">
                Store Location Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#1A2A4A]/5 rounded-full border border-gray-100 text-[#E53935] mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1A2A4A]">Our Headquarters</h4>
                    <p className="text-gray-500 font-medium pt-0.5">100 University Ave, Toronto, ON, Canada</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                  <div className="p-2.5 bg-[#1A2A4A]/5 rounded-full border border-gray-100 text-[#E53935] mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1A2A4A]">Phone Numbers</h4>
                    <p className="text-gray-500 font-medium pt-0.5">+1 (800) 555-0199</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                  <div className="p-2.5 bg-[#1A2A4A]/5 rounded-full border border-gray-100 text-[#E53935] mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1A2A4A]">Support Email</h4>
                    <p className="text-gray-500 font-medium pt-0.5">info@ventershop.ca</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized Maps Card */}
            <div className="bg-[#101A2D] text-white p-6 rounded-3xl border border-gray-800 shadow-xs relative overflow-hidden h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')" }} />
              <div className="relative text-center z-10 space-y-2">
                <span className="inline-block bg-[#E53935] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Google Maps Location
                </span>
                <p className="text-xs font-bold text-gray-300">Toronto, Ontario, Canada</p>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
