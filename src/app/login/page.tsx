'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { User, ShieldCheck, Mail, Clock, Phone, Globe, Lock } from 'lucide-react';

function LoginContent() {
  const { t } = useTranslation();
  const { refreshSession, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Tabs: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Steps: 1 = Form inputs, 2 = Verify OTP (Only for registration)
  const [step, setStep] = useState(1);
  
  // Common
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration specific fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [prefLang, setPrefLang] = useState<'en' | 'ta'>('en');
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      router.push(callbackUrl);
    }
  }, [user, callbackUrl, router]);

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (activeTab === 'login') {
      if (!password) {
        setErrorMsg('Please enter your password.');
        setLoading(false);
        return;
      }

      // 1. PASSWORD-BASED LOGIN FLOW (Sends password, otp bypass bypasses code)
      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
            otp: 'PASSWORD_LOGIN', // Instructs verify-otp to do password verification
          }),
        });

        const data = await res.json();
        if (res.ok) {
          await refreshSession();
          if (data.user?.role === 'ADMIN' || data.user?.role === 'SUPER_ADMIN') {
            router.push('/admin');
          } else {
            router.push(callbackUrl);
          }
        } else {
          setErrorMsg(data.error || 'Invalid email or password.');
        }
      } catch (err) {
        setErrorMsg('Network error. Failed to log in.');
      } finally {
        setLoading(false);
      }
    } else {
      // 2. REGISTRATION FLOW (Requires OTP verification)
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || !password) {
        setErrorMsg('Please fill out all registration fields.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccessMsg('Account details saved! A 6-digit OTP verification code was sent to your email.');
          setStep(2);
        } else {
          setErrorMsg(data.error || 'Failed to send verification code.');
        }
      } catch (err) {
        setErrorMsg('Network error. Failed to register.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Verify OTP (Only for Registration Step 2)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!otp.trim()) {
      setErrorMsg('Please enter the verification code.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          password: password, // Save this password
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          preferredLanguage: prefLang,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshSession();
        router.push(callbackUrl);
      } else {
        setErrorMsg(data.error || 'Invalid verification code.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-2xl border border-gray-150 shadow-xs space-y-6 text-xs font-semibold text-gray-800">
      
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100 text-[#E53935] mx-auto shadow-2xs">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-[#101A2D] uppercase tracking-tight">
          {step === 1 ? (activeTab === 'login' ? 'Customer Login' : 'Register Profile') : 'OTP Verification'}
        </h2>
        <p className="text-xs text-gray-500 font-semibold leading-normal">
          {step === 1 
            ? (activeTab === 'login' 
                ? 'Sign in securely using your email and password.'
                : 'Complete the form to register a new customer account.')
            : `Enter the 6-digit verification code sent to ${email}`}
        </p>
      </div>

      {/* Tabs Selector - Only shown on Step 1 */}
      {step === 1 && (
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 text-center py-2.5 font-bold uppercase tracking-wider transition-colors border-b-2 text-xs ${
              activeTab === 'login'
                ? 'border-[#1A2A4A] text-[#1A2A4A]'
                : 'border-transparent text-gray-400 hover:text-gray-655'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 text-center py-2.5 font-bold uppercase tracking-wider transition-colors border-b-2 text-xs ${
              activeTab === 'register'
                ? 'border-[#1A2A4A] text-[#1A2A4A]'
                : 'border-transparent text-gray-400 hover:text-gray-655'
            }`}
          >
            Register
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-100 font-extrabold">
          ✓ {successMsg}
        </div>
      )}

      {/* STEP 1: Enter Details */}
      {step === 1 && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Email Address - Always required */}
          <div className="space-y-1.5">
            <label className="text-gray-700 font-bold block mb-1">Email Address *</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="e.g. customer@ventershop.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
              />
            </div>
          </div>

          {/* Password field - required for both login and register */}
          <div className="space-y-1.5">
            <label className="text-gray-700 font-bold block mb-1">Password *</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
              />
            </div>
          </div>

          {/* Registration only fields */}
          {activeTab === 'register' && (
            <div className="space-y-4 animate-fade-in-up">
              
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-gray-700 font-bold block mb-1">Phone Number *</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (416) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s()-]/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div className="space-y-1.5">
                <label className="text-gray-700 font-bold block mb-1">Preferred Language *</label>
                <div className="relative flex items-center">
                  <Globe className="absolute left-3 w-4 h-4 text-gray-400" />
                  <select
                    value={prefLang}
                    onChange={(e) => setPrefLang(e.target.value as 'en' | 'ta')}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 appearance-none bg-no-repeat"
                  >
                    <option value="en">English</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center bg-[#1A2A4A] hover:bg-[#101A2D] text-white font-bold rounded-lg uppercase tracking-wider shadow-xs transition-colors"
          >
            {loading ? 'Processing...' : (activeTab === 'login' ? 'Instant Secure Login' : 'Send Registration OTP')}
          </button>
        </form>
      )}

      {/* STEP 2: Enter OTP (Only for Registration verification) */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-gray-700 font-bold block mb-1">6-Digit Verification Code *</label>
            <div className="relative flex items-center">
              <Clock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                maxLength={6}
                required
                placeholder="e.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] font-mono tracking-widest text-center text-sm font-extrabold text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center bg-[#E53935] hover:bg-[#c62828] text-white font-bold rounded-lg uppercase tracking-wider shadow-xs transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify & Complete Registration'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="w-full text-center text-gray-500 hover:text-black font-extrabold uppercase py-1"
          >
            ← Back to details
          </button>
        </form>
      )}

      {/* Safety info */}
      <div className="text-[10px] text-gray-400 font-semibold leading-normal flex items-start gap-1.5 border-t border-gray-100 pt-4">
        <ShieldCheck className="w-4 h-4 text-[#1A2A4A] shrink-0 mt-0.5" />
        <span>VenterShop uses secure validation. Ethereal mail logs (found in Next.js console logs) provide clickable preview links for the OTP code.</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="flex-grow py-12 px-4 flex items-center justify-center">
        <Suspense fallback={<div className="w-96 h-80 bg-white rounded-2xl animate-pulse" />}>
          <LoginContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
