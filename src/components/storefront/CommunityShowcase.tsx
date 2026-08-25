'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Users, CheckCircle, Sparkles, MapPin, Building2, ArrowRight, ShieldCheck } from 'lucide-react';

interface ICommunityGroup {
  _id: string;
  name: string;
  description: string;
  memberCount: number;
}

export default function CommunityShowcase() {
  const { user, refreshSession } = useAuth();
  const { t, language } = useTranslation();

  const [communities, setCommunities] = useState<ICommunityGroup[]>([]);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const res = await fetch('/api/communities');
        if (res.ok) {
          const data = await res.json();
          setCommunities(data.communities || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchCommunities();
  }, []);

  const handleJoin = async (commId: string) => {
    if (!user) {
      window.location.href = '/login?callbackUrl=/';
      return;
    }

    setJoiningId(commId);
    setMsg(null);

    try {
      const res = await fetch('/api/customer/join-community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId: commId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: data.message });
        await refreshSession(); // Update AuthContext user.customerType to COMMUNITY
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to join group.' });
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Network error while joining community.' });
    } finally {
      setJoiningId(null);
    }
  };

  const isCommunityMember = user?.customerType === 'COMMUNITY' && user?.communityStatus === 'APPROVED';
  const isPendingCommunity = user?.communityStatus === 'PENDING';
  const isWholesaleUser = user?.customerType === 'WHOLESALE';

  return (
    <section className="w-full bg-gradient-to-b from-[#101A2D] to-[#1A2A4A] py-16 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-[#E53935]/20 text-[#FF6B6B] border border-[#E53935]/30 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ta' ? 'வாடிக்கையாளர் திட்டங்கள்' : 'Exclusive Customer Programs'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase leading-tight">
            {language === 'ta'
              ? 'VenterShop சமூகக் குழுவில் சேர்ந்து சிறப்புத் தள்ளுபடி பெறுங்கள்'
              : 'Join a VenterShop Community & Unlock Group Savings'}
          </h2>
          <p className="text-sm text-gray-300 font-semibold leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் பிராந்திய சமூகக் குழுவில் 1-கிளிக் மூலம் சேர்ந்து சிறப்புக் சலுகைகள் மற்றும் பிரத்யேக வவுச்சர்களைப் பெறுங்கள்.'
              : 'Select your local community group below to instantly unlock community-member pricing, exclusive discount vouchers, and targeted offers.'}
          </p>
        </div>

        {msg && (
          <div
            className={`max-w-md mx-auto p-3.5 rounded-xl font-extrabold text-xs text-center border ${
              msg.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                : 'bg-red-950/80 text-red-300 border-red-500/50'
            }`}
          >
            {msg.type === 'success' ? '✓ ' : '⚠️ '}
            {msg.text}
          </div>
        )}

        {/* Communities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
          
          {/* Card 1: Toronto Tamil Community */}
          {communities.map((comm) => {
            const isUserInThisCommunity = isCommunityMember && user?.communityId === comm._id;

            return (
              <div
                key={comm._id}
                className={`bg-white/5 backdrop-blur-md p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
                  isUserInThisCommunity
                    ? 'border-emerald-500/80 shadow-lg shadow-emerald-500/10 bg-white/10'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/8'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-[#E53935]/20 border border-[#E53935]/40 flex items-center justify-center text-[#FF6B6B]">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] bg-white/10 text-gray-300 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Canada Region
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{comm.name}</h3>
                    <p className="text-[10px] text-[#FF6B6B] font-bold uppercase mt-0.5">
                      {comm.memberCount}+ Verified Members
                    </p>
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed">
                    {comm.description}
                  </p>

                  <div className="pt-2 space-y-1.5 text-[11px] text-gray-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>10% - 15% Off Grocery Categories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Dedicated Community Vouchers Wallet</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  {isUserInThisCommunity ? (
                    <div className="w-full py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Joined Member ✓
                    </div>
                  ) : isPendingCommunity && user?.communityId === comm._id ? (
                    <div className="w-full py-2.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                      ⏳ Awaiting Admin Approval
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(comm._id)}
                      disabled={joiningId === comm._id || isPendingCommunity || isCommunityMember}
                      className="w-full py-3 bg-[#E53935] hover:bg-[#c62828] text-white font-bold rounded-xl uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {joiningId === comm._id ? 'Submitting Request...' : (user ? 'Join Community (Pending Approval)' : 'Login to Join Group')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Card 3: B2B Wholesale Application Banner */}
          <div className="bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 backdrop-blur-md p-6 rounded-2xl border border-emerald-500/30 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
                  B2B Segment
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-white">Wholesale Business Buyer</h3>
                <p className="text-[10px] text-emerald-400 font-bold uppercase mt-0.5">
                  Commercial & Bulk Purchasing
                </p>
              </div>

              <p className="text-gray-300 text-xs leading-relaxed">
                Operating a store or ordering bulk quantities? Apply for VenterShop Wholesale tier pricing to unlock bulk discounts up to 30% and commercial logistics.
              </p>

              <div className="pt-2 space-y-1.5 text-[11px] text-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Wholesale Base Prices per SKU</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Volume Bulk Matrix Savings</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-500/20">
              {isWholesaleUser ? (
                <div className="w-full py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Approved B2B Buyer ✓
                </div>
              ) : (
                <Link
                  href={user ? '/dashboard/wholesale' : '/login?callbackUrl=/dashboard/wholesale'}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Apply for Wholesale Tier</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
