'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          otp: 'PASSWORD_LOGIN',
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        const role = data.user?.role;
        const customerType = data.user?.customerType;
        if (role === 'ADMIN' || role === 'SUPER_ADMIN' || customerType === 'ADMIN') {
          // Hard refresh to reload JWT admin_session cookie set by server
          window.location.href = '/admin';
        } else {
          setErrorMsg('Access denied. This account does not have Administrator privileges.');
        }
      } else {
        setErrorMsg(data.error || 'Invalid administrator email or password.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to authenticate administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101A2D] text-white flex flex-col justify-center items-center p-4 font-sans antialiased text-xs font-semibold select-none">
      
      {/* Container Box */}
      <div className="w-full max-w-md bg-[#1A2A4A] border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E53935]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 bg-[#E53935]/15 border border-[#E53935]/30 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8 text-[#E53935]" />
          </div>
          <h1 className="text-xl font-black tracking-widest uppercase text-white">
            VENTERSHOP ADMIN
          </h1>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">
            CONTROL PANEL ACCESS PORTAL
          </span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-[#FF8A80] p-3.5 rounded-xl text-xs font-extrabold flex items-start gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold block">Administrator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#101A2D] border border-white/10 rounded-xl outline-none focus:border-[#E53935] text-white font-bold text-xs"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#101A2D] border border-white/10 rounded-xl outline-none focus:border-[#E53935] text-white font-bold text-xs"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#E53935] hover:bg-[#c62828] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:bg-gray-600"
          >
            <span>{loading ? 'Authenticating...' : 'Login to Admin Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Footer Return Link */}
      <a
        href="/"
        className="mt-6 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
      >
        ← Return to Storefront
      </a>

    </div>
  );
}
