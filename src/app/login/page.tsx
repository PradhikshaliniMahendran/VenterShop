'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { User, ShieldCheck, Mail, Clock, Phone, Globe, Lock, ShoppingBag, Users, Building2, Check } from 'lucide-react';

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
  const [customerType, setCustomerType] = useState<'NORMAL' | 'COMMUNITY' | 'WHOLESALE'>('NORMAL');
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

      // 1. PASSWORD-BASED LOGIN FLOW
      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
            otp: 'PASSWORD_LOGIN',
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
          password: password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          customerType: customerType,
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
    <div className="w-full max-w-lg mx-auto my-8 sm:my-12 p-5 sm:p-8 bg-white rounded-2xl border border-gray-150 shadow-xs space-y-6 text-xs font-semibold text-gray-800">
      
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
                : 'Choose your account type and complete registration.')
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
                : 'border-transparent text-gray-400 hover:text-gray-600'
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
                : 'border-transparent text-gray-400 hover:text-gray-600'
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
          
          {/* Account Type Selection (Only for Register) */}
          {activeTab === 'register' && (
            <div className="space-y-2 pt-1 pb-2">
              <label className="text-gray-800 font-extrabold block text-xs">
                Select Account Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* 1. Normal Customer */}
                <button
                  type="button"
                  onClick={() => setCustomerType('NORMAL')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                    customerType === 'NORMAL'
                      ? 'border-[#1A2A4A] bg-blue-50/50 shadow-xs ring-1 ring-[#1A2A4A]'
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <ShoppingBag className={`w-4 h-4 ${customerType === 'NORMAL' ? 'text-[#1A2A4A]' : 'text-gray-500'}`} />
                    {customerType === 'NORMAL' && (
                      <span className="w-4 h-4 bg-[#1A2A4A] text-white rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-extrabold text-[#101A2D] text-xs block">Normal Buyer</span>
                    <span className="text-[10px] text-gray-500 font-medium leading-tight block mt-0.5">
                      Standard retail prices & delivery
                    </span>
                  </div>
                </button>

                {/* 2. Community Member */}
                <button
                  type="button"
                  onClick={() => setCustomerType('COMMUNITY')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                    customerType === 'COMMUNITY'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Users className={`w-4 h-4 ${customerType === 'COMMUNITY' ? 'text-emerald-600' : 'text-gray-500'}`} />
                    {customerType === 'COMMUNITY' && (
                      <span className="w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-800 text-xs block">Community</span>
                    <span className="text-[10px] text-gray-500 font-medium leading-tight block mt-0.5">
                      Special group member savings
                    </span>
                  </div>
                </button>

                {/* 3. Wholesale Buyer */}
                <button
                  type="button"
                  onClick={() => setCustomerType('WHOLESALE')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                    customerType === 'WHOLESALE'
                      ? 'border-[#E53935] bg-red-50/50 shadow-xs ring-1 ring-[#E53935]'
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Building2 className={`w-4 h-4 ${customerType === 'WHOLESALE' ? 'text-[#E53935]' : 'text-gray-500'}`} />
                    {customerType === 'WHOLESALE' && (
                      <span className="w-4 h-4 bg-[#E53935] text-white rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-extrabold text-[#E53935] text-xs block">Wholesale</span>
                    <span className="text-[10px] text-gray-500 font-medium leading-tight block mt-0.5">
                      B2B & bulk tiered catalog
                    </span>
                  </div>
                </button>

              </div>
            </div>
          )}

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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 appearance-none bg-no-repeat cursor-pointer"
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
            <p className="text-[11px] text-gray-400">
              Valid for 5 minutes. Check your inbox and spam folder.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center bg-[#E53935] hover:bg-[#c62828] text-white font-bold rounded-lg uppercase tracking-wider shadow-xs transition-colors"
          >
            {loading ? 'Verifying Account...' : 'Complete Registration & Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center py-2 text-xs text-gray-500 hover:text-black font-semibold hover:underline"
          >
            ← Back to form
          </button>
        </form>
      )}

      {/* Security Reassurance */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-[11px]">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>256-Bit Encrypted & Canada Privacy Compliant</span>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Suspense
          fallback={
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#1A2A4A] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <LoginContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
