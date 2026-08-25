'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Users, CheckCircle, Ticket, Clock, Sparkles, MapPin, RefreshCw } from 'lucide-react';

interface ICommunityDetail {
  _id: string;
  name: string;
  description: string;
  memberCount: number;
  membershipCode: string;
  isActive: boolean;
}

interface IGroupVoucher {
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumOrderValue: number;
  endDate: string;
}

export default function DashboardCommunityPage() {
  const { user, refreshSession } = useAuth();
  const { t } = useTranslation();

  const [community, setCommunity] = useState<ICommunityDetail | null>(null);
  const [vouchers, setVouchers] = useState<IGroupVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadCommunityInfo() {
      if (!user || !user.communityId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch community details
        const commRes = await fetch(`/api/customer/community-info`);
        if (commRes.ok) {
          const commData = await commRes.json();
          setCommunity(commData.community);
        }

        // Only load vouchers if approved
        if (user.communityStatus === 'APPROVED') {
          const res = await fetch('/api/customer/vouchers');
          if (res.ok) {
            const data = await res.json();
            setVouchers(data.available || []);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCommunityInfo();
  }, [user]);

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    try {
      await refreshSession();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4" />
        <div className="h-48 bg-white rounded-xl border border-gray-150 animate-pulse" />
      </div>
    );
  }

  const isApproved = user.customerType === 'COMMUNITY' && user.communityStatus === 'APPROVED';
  const isPending = user.communityStatus === 'PENDING';
  const isMember = isApproved && user.communityId;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <h1 className="text-xl font-black text-[#101A2D] tracking-tight uppercase border-b border-gray-150 pb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-[#E53935]" />
        {t('dashCommunity')}
      </h1>

      {/* PENDING STATE */}
      {isPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-amber-800">Membership Request Pending</h3>
            <p className="text-xs text-amber-700 leading-relaxed font-semibold">
              Your request to join{community ? ` "${community.name}"` : ' this community'} is under review.
              You will receive community benefits once an administrator approves your request.
            </p>
          </div>
          {community && (
            <div className="bg-white/70 p-3 rounded-xl border border-amber-100 text-left space-y-1">
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Requested Community</p>
              <p className="font-bold text-[#1A2A4A] text-xs">{community.name}</p>
              <p className="text-[10px] text-gray-500 font-mono">{community.membershipCode}</p>
            </div>
          )}
          <button
            onClick={handleRefreshStatus}
            disabled={refreshing}
            className="flex items-center gap-1.5 mx-auto py-2 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking...' : 'Check Approval Status'}
          </button>
        </div>
      )}

      {/* NOT A MEMBER */}
      {!isMember && !isPending && (
        <div className="bg-white rounded-xl border border-gray-150 p-12 text-center text-xs text-gray-500 font-semibold max-w-md mx-auto space-y-4">
          <Users className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-extrabold text-sm text-[#101A2D]">Not a Community Member</h3>
          <p className="leading-relaxed">
            You are not currently registered in a community group. Visit your dashboard home to join a community using a membership code.
          </p>
        </div>
      )}

      {/* APPROVED MEMBER VIEW */}
      {isMember && (
        <div className="space-y-6">
          {/* Group Header Card */}
          {community && (
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#101A2D]">{community.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    Community Member Program
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-sm tracking-wider inline-flex items-center gap-0.5 shadow-sm">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Approved Member
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                {community.description}
              </p>
              <div className="flex gap-4 pt-2 border-t border-gray-100 text-[10px] text-gray-400 font-bold">
                <span>Code: <span className="font-mono text-[#1A2A4A]">{community.membershipCode}</span></span>
                <span>Members: <span className="text-[#1A2A4A]">{community.memberCount}</span></span>
              </div>
            </div>
          )}

          {/* Benefits Badge */}
          <div className="bg-gradient-to-r from-[#1A2A4A] to-[#243560] p-4 rounded-xl text-white text-xs font-bold flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-extrabold text-sm">Community Pricing Unlocked 🎉</p>
              <p className="text-white/70 text-[10px] font-semibold mt-0.5">You receive exclusive community member pricing on all eligible products automatically.</p>
            </div>
          </div>

          {/* Targeted Vouchers list */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Ticket className="w-4 h-4 text-gray-400" />
              Your Community Vouchers
            </h3>
            
            {vouchers.length === 0 ? (
              <p className="text-xs text-gray-400 font-semibold p-4 text-center bg-white rounded-xl border border-gray-150">
                No active community vouchers in your wallet right now. Check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                {vouchers.map((v, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="bg-red-50 text-[#E53935] text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm border border-red-100 uppercase">
                        {v.discountType === 'PERCENTAGE' ? `${v.discountValue}% OFF` : `$${v.discountValue} OFF`}
                      </span>
                      <p className="font-extrabold text-[#1A2A4A] text-sm">{v.code}</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px] line-clamp-1 truncate">
                        {v.description}
                      </p>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(v.code); window.location.href = '/shop'; }}
                      className="py-1 px-3 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg text-[10px] font-bold uppercase transition-colors"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
