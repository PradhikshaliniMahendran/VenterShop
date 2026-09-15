'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  User,
  ShieldCheck,
  Mail,
  Clock,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

function LoginContent() {
  const { language } = useTranslation();
  const isTa = language === 'ta';
  const { refreshSession, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Tabs: 'login' | 'register' | 'forgot'
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Steps: 1 = Form inputs, 2 = Verify OTP (For register or forgot password)
  const [step, setStep] = useState(1);

  // Common
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password specific fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Registration specific fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [customerType, setCustomerType] = useState('BUYER');
  const [prefLang, setPrefLang] = useState<'en' | 'ta' | 'si'>('en');

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect to dashboard or callbackUrl immediately
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else {
        router.push(callbackUrl);
      }
    }
  }, [user, callbackUrl, router]);

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg(isTa ? 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (activeTab === 'login') {
      if (!password) {
        setErrorMsg(isTa ? 'தயவுசெய்து உங்கள் கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter your password.');
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
          setErrorMsg(data.error || (isTa ? 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்.' : 'Invalid email or password.'));
        }
      } catch (err) {
        setErrorMsg(isTa ? 'இணைப்பு பிழை. உள்நுழைய முடியவில்லை.' : 'Network error. Failed to log in.');
      } finally {
        setLoading(false);
      }
    } else if (activeTab === 'register') {
      // 2. REGISTRATION FLOW (Requires OTP verification)
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || !password) {
        setErrorMsg(isTa ? 'தயவுசெய்து அனைத்து விவரங்களையும் நிரப்பவும்.' : 'Please fill out all registration fields.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMsg(isTa ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்களாக இருக்க வேண்டும்.' : 'Password must be at least 6 characters long.');
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
          setSuccessMsg(
            isTa
              ? 'கணக்கு விவரங்கள் சேமிக்கப்பட்டன! உங்கள் மின்னஞ்சலுக்கு 6 இலக்க OTP குறியீடு அனுப்பப்பட்டுள்ளது.'
              : 'Account details saved! A 6-digit OTP verification code was sent to your email.'
          );
          setStep(2);
        } else {
          setErrorMsg(data.error || (isTa ? 'சரிபார்ப்புக் குறியீட்டை அனுப்ப முடியவில்லை.' : 'Failed to send verification code.'));
        }
      } catch (err) {
        setErrorMsg(isTa ? 'இணைப்பு பிழை. பதிவு செய்ய முடியவில்லை.' : 'Network error. Failed to register.');
      } finally {
        setLoading(false);
      }
    } else if (activeTab === 'forgot') {
      // 3. FORGOT PASSWORD STEP 1: Send Reset OTP
      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccessMsg(
            isTa
              ? 'உங்கள் கடவுச்சொல்லை மீட்டமைக்க 6 இலக்க OTP குறியீடு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டுள்ளது.'
              : 'A 6-digit OTP verification code was sent to your email to reset your password.'
          );
          setStep(2);
        } else {
          setErrorMsg(data.error || (isTa ? 'சரிபார்ப்புக் குறியீட்டை அனுப்ப முடியவில்லை.' : 'Failed to send verification code.'));
        }
      } catch (err) {
        setErrorMsg(isTa ? 'இணைப்பு பிழை. குறியீட்டை அனுப்ப முடியவில்லை.' : 'Network error. Failed to send reset code.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Verify OTP for Registration (Step 2)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!otp.trim()) {
      setErrorMsg(isTa ? 'தயவுசெய்து சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்.' : 'Please enter the verification code.');
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
        setErrorMsg(data.error || (isTa ? 'தவறான சரிபார்ப்புக் குறியீடு.' : 'Invalid verification code.'));
      }
    } catch (err) {
      setErrorMsg(isTa ? 'இணைப்பு பிழை. சரிபார்க்க முடியவில்லை.' : 'Network error. Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password with OTP (Forgot Password Step 2)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!otp.trim()) {
      setErrorMsg(isTa ? 'தயவுசெய்து சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்.' : 'Please enter the verification code.');
      setLoading(false);
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg(isTa ? 'புதிய கடவுச்சொல் குறைந்தது 6 எழுத்துக்களாக இருக்க வேண்டும்.' : 'New password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(isTa ? 'கடவுச்சொற்கள் பொருந்தவில்லை. மீண்டும் சரிபார்க்கவும்.' : 'Passwords do not match. Please check again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshSession();
        setSuccessMsg(isTa ? 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது! உள்நுழைகிறது...' : 'Password reset successfully! Redirecting...');
        setTimeout(() => {
          if (data.user?.role === 'ADMIN' || data.user?.role === 'SUPER_ADMIN') {
            router.push('/admin');
          } else {
            router.push(callbackUrl);
          }
        }, 1000);
      } else {
        setErrorMsg(data.error || (isTa ? 'கடவுச்சொல்லை மாற்ற முடியவில்லை.' : 'Failed to reset password.'));
      }
    } catch (err) {
      setErrorMsg(isTa ? 'இணைப்பு பிழை. கடவுச்சொல்லை மாற்ற முடியவில்லை.' : 'Network error. Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'forgot') {
      return step === 1
        ? (isTa ? 'கடவுச்சொல்லை மீட்டமைக்க' : 'Forgot Password')
        : (isTa ? 'புதிய கடவுச்சொல்லை அமைக்க' : 'Reset Password');
    }
    if (step === 2) {
      return isTa ? 'OTP சரிபார்ப்பு' : 'OTP Verification';
    }
    return activeTab === 'login'
      ? (isTa ? 'வாடிக்கையாளர் உள்நுழைவு' : 'Customer Login')
      : (isTa ? 'புதிய கணக்கு பதிவு' : 'Register Profile');
  };

  const getHeaderSubtitle = () => {
    if (activeTab === 'forgot') {
      return step === 1
        ? (isTa ? 'உங்கள் கணக்கின் மின்னஞ்சலை உள்ளிட்டு OTP குறியீட்டைப் பெறுங்கள்.' : 'Enter your registered email to receive a password reset OTP.')
        : (isTa ? `${email} முகவரிக்கு அனுப்பப்பட்ட 6 இலக்க குறியீட்டை உள்ளிட்டு புதிய கடவுச்சொல்லை அமைக்கவும்.` : `Enter the 6-digit code sent to ${email} and set your new password.`);
    }
    if (step === 2) {
      return isTa ? `${email} முகவரிக்கு அனுப்பப்பட்ட 6 இலக்க சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்.` : `Enter the 6-digit verification code sent to ${email}`;
    }
    return activeTab === 'login'
      ? (isTa ? 'உங்கள் மின்னஞ்சல் மற்றும் கடவுச்சொல்லைப் பயன்படுத்தி பாதுகாப்பாக உள்நுழையுங்கள்.' : 'Sign in securely using your email and password.')
      : (isTa ? 'உங்கள் கணக்கு வகையைத் தேர்ந்தெடுத்து பதிவை நிறைவு செய்யுங்கள்.' : 'Choose your account type and complete registration.');
  };

  return (
    <div className="w-full max-w-lg mx-auto my-8 sm:my-12 p-5 sm:p-8 bg-white rounded-2xl border border-gray-150 shadow-xs space-y-6 text-xs font-semibold text-gray-800">
      
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100 text-[#801414] mx-auto shadow-2xs">
          {activeTab === 'forgot' ? <KeyRound className="w-6 h-6" /> : <User className="w-6 h-6" />}
        </div>
        <h2 className="text-xl font-black text-[#101A2D] uppercase tracking-tight">
          {getHeaderTitle()}
        </h2>
        <p className="text-xs text-gray-500 font-semibold leading-normal">
          {getHeaderSubtitle()}
        </p>
      </div>

      {/* Tabs Selector - Only shown on Step 1 when not in forgot password mode */}
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
                ? 'border-[#801414] text-[#801414]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {isTa ? 'உள்நுழைவு' : 'Login'}
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
                ? 'border-[#801414] text-[#801414]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {isTa ? 'பதிவு செய்க' : 'Register'}
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

      {/* STEP 1: Enter Details (Login / Register / Forgot Step 1) */}
      {step === 1 && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Account Type Selection (Only for Register) */}
          {activeTab === 'register' && (
            <div className="space-y-1.5 pt-1 pb-1">
              <label className="text-gray-800 font-extrabold block text-xs">
                {isTa ? 'கணக்கு வகை (Account Type) *' : 'Account Type *'}
              </label>
              <div className="relative">
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:bg-white focus:border-[#801414] focus:ring-2 focus:ring-[#801414]/20 text-gray-900 font-bold text-xs appearance-none cursor-pointer"
                >
                  <option value="BUYER">{isTa ? 'Buyer (வாங்குபவர்)' : 'Buyer (Retail Consumer)'}</option>
                  <option value="V2CC_PMS_MEMBER">V2CC-PMS Member (Community Member Pricing)</option>
                  <option value="WHOLESALE_BUYER">Wholesale Buyer (Bulk B2B Pricing)</option>
                  <option value="SELLER_SUPPLIER">Seller / Supplier (விற்பனையாளர் / சப்ளையர்)</option>
                  <option value="PARTNER_STORE">Partner Store (பங்குதாரர் கடை)</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
                  ▼
                </div>
              </div>
              <p className="text-[10px] text-gray-500 font-medium pt-0.5">
                {customerType === 'BUYER' && 'Standard consumer retail ordering and doorstep delivery.'}
                {customerType === 'V2CC_PMS_MEMBER' && 'Exclusive community member benefits & discounted tier pricing.'}
                {customerType === 'WHOLESALE_BUYER' && 'High-volume wholesale catalog & bulk commercial rates.'}
                {customerType === 'SELLER_SUPPLIER' && 'Register as merchant/supplier to distribute products.'}
                {customerType === 'PARTNER_STORE' && 'Partner store franchise & integrated inventory point.'}
              </p>
            </div>
          )}

          {/* Email Address - Always required */}
          <div className="space-y-1.5">
            <label className="text-gray-700 font-bold block mb-1">
              {isTa ? 'மின்னஞ்சல் முகவரி *' : 'Email Address *'}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="e.g. customer@ventershop.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-bold"
              />
            </div>
          </div>

          {/* Password field - for login and register */}
          {activeTab !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-bold block">
                  {isTa ? 'கடவுச்சொல் *' : 'Password *'}
                </label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setStep(1);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-bold text-[#801414] hover:underline cursor-pointer"
                  >
                    {isTa ? 'கடவுச்சொல் மறந்துவிட்டதா?' : 'Forgot Password?'}
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-bold"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-700 cursor-pointer p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Registration only fields */}
          {activeTab === 'register' && (
            <div className="space-y-4 animate-fade-in-up">
              
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold block mb-1">
                    {isTa ? 'முதல் பெயர் *' : 'First Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold block mb-1">
                    {isTa ? 'கடைசி பெயர் *' : 'Last Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-bold"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-gray-700 font-bold block mb-1">
                  {isTa ? 'தொலைபேசி எண் *' : 'Phone Number *'}
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s()-]/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-bold"
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div className="space-y-1.5">
                <label className="text-gray-700 font-bold block mb-1">
                  {isTa ? 'விருப்பமான மொழி *' : 'Preferred Language *'}
                </label>
                <div className="relative flex items-center">
                  <Globe className="absolute left-3 w-4 h-4 text-gray-400" />
                  <select
                    value={prefLang}
                    onChange={(e) => setPrefLang(e.target.value as 'en' | 'ta' | 'si')}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 appearance-none bg-no-repeat cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="si">සිංහල (Sinhala)</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center bg-[#801414] hover:bg-[#600e0e] text-white font-bold rounded-lg uppercase tracking-wider shadow-xs transition-colors cursor-pointer disabled:bg-gray-400"
          >
            {loading
              ? (isTa ? 'செயலாக்குகிறது...' : 'Processing...')
              : activeTab === 'login'
              ? (isTa ? 'பாதுகாப்பாக உள்நுழைக' : 'Instant Secure Login')
              : activeTab === 'register'
              ? (isTa ? 'பதிவு OTP அனுப்புக' : 'Send Registration OTP')
              : (isTa ? 'மீட்டமைப்பு OTP அனுப்புக' : 'Send Reset OTP')}
          </button>

          {/* Forgot Password: Back to Login link */}
          {activeTab === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="w-full text-center py-2 text-xs text-gray-500 hover:text-black font-semibold hover:underline flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isTa ? 'மீண்டும் உள்நுழைவு செல்ல' : 'Back to Login'}</span>
            </button>
          )}

        </form>
      )}

      {/* STEP 2 for Registration: Enter OTP */}
      {step === 2 && activeTab === 'register' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-gray-700 font-bold block mb-1">
              {isTa ? '6 இலக்க சரிபார்ப்புக் குறியீடு *' : '6-Digit Verification Code *'}
            </label>
            <div className="relative flex items-center">
              <Clock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                maxLength={6}
                required
                placeholder="e.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] font-mono tracking-widest text-center text-sm font-extrabold text-gray-900"
              />
            </div>
            <p className="text-[11px] text-gray-400">
              {isTa ? '5 நிமிடங்களுக்கு செல்லுபடியாகும். உங்கள் இன்பாக்ஸ் & ஸ்பேம் கோப்புறையை சரிபார்க்கவும்.' : 'Valid for 5 minutes. Check your inbox and spam folder.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center bg-[#801414] hover:bg-[#600e0e] text-white font-bold rounded-lg uppercase tracking-wider shadow-xs transition-colors cursor-pointer disabled:bg-gray-400"
          >
            {loading ? (isTa ? 'சரிபார்க்கிறது...' : 'Verifying Account...') : (isTa ? 'பதிவை முடித்து உள்நுழைக' : 'Complete Registration & Sign In')}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center py-2 text-xs text-gray-500 hover:text-black font-semibold hover:underline flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isTa ? 'படிவத்திற்குத் திரும்பு' : 'Back to form'}</span>
          </button>
        </form>
      )}

      {/* STEP 2 for Forgot Password: Enter OTP & Set New Password */}
      {step === 2 && activeTab === 'forgot' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          
          {/* OTP Input */}
          <div className="space-y-1.5">
            <label className="text-gray-700 font-bold block mb-1">
              {isTa ? '6 இலக்க சரிபார்ப்புக் குறியீடு *' : '6-Digit Verification Code *'}
            </label>
            <div className="relative flex items-center">
              <Clock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                maxLength={6}
                required
                placeholder="e.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] font-mono tracking-widest text-center text-sm font-extrabold text-gray-900"
              />
            </div>
          </div>

          {/* New Password Input with Eye toggle */}
          <div className="space-y-1.5">
            <label className="text-gray-700 font-bold block mb-1">
              {isTa ? 'புதிய கடவுச்சொல் *' : 'New Password *'}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-bold"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-700 cursor-pointer p-0.5"
                title={showNewPassword ? 'Hide password' : 'Show password'}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">
              {isTa ? 'குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்.' : 'Must be at least 6 characters.'}
            </p>
          </div>

          {/* Confirm New Password Input with Eye toggle */}
          <div className="space-y-1.5">
            <label className="text-gray-700 font-bold block mb-1">
              {isTa ? 'புதிய கடவுச்சொல்லை உறுதிப்படுத்துக *' : 'Confirm New Password *'}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-bold"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-700 cursor-pointer p-0.5"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center bg-[#801414] hover:bg-[#600e0e] text-white font-bold rounded-lg uppercase tracking-wider shadow-xs transition-colors cursor-pointer disabled:bg-gray-400"
          >
            {loading ? (isTa ? 'மாற்றுகிறது...' : 'Resetting Password...') : (isTa ? 'கடவுச்சொல்லை மாற்றி உள்நுழைக' : 'Reset Password & Sign In')}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center py-2 text-xs text-gray-500 hover:text-black font-semibold hover:underline flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isTa ? 'மின்னஞ்சல் மாற்ற' : 'Change Email Address'}</span>
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
              <div className="inline-block w-8 h-8 border-4 border-[#801414] border-t-transparent rounded-full animate-spin" />
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
