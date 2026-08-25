'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { Ticket, Copy, Check, Clock, AlertCircle } from 'lucide-react';

interface IVoucherItem {
  _id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumOrderValue: number;
  endDate: string;
  categoryIds?: { _id: string; name: string }[];
  productIds?: { _id: string; name: string }[];
  communityIds?: { _id: string; name: string }[];
}

export default function DashboardVouchersPage() {
  const { t, language } = useTranslation();
  const router = useRouter();

  const [available, setAvailable] = useState<IVoucherItem[]>([]);
  const [used, setUsed] = useState<IVoucherItem[]>([]);
  const [expired, setExpired] = useState<IVoucherItem[]>([]);
  const [loading, setLoading] = useState(true);

  // UI Tabs: 'active' | 'used' | 'expired'
  const [activeTab, setActiveTab] = useState<'active' | 'used' | 'expired'>('active');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 1. Fetch vouchers wallet data
  useEffect(() => {
    async function loadVouchers() {
      try {
        const res = await fetch('/api/customer/vouchers');
        if (res.ok) {
          const data = await res.json();
          setAvailable(data.available || []);
          setUsed(data.used || []);
          setExpired(data.expired || []);
        }
      } catch (e) {
        console.error('Failed to load customer vouchers:', e);
      } finally {
        setLoading(false);
      }
    }
    loadVouchers();
  }, []);

  const { setAppliedVoucherCode } = useCart();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleUseNow = (code: string) => {
    navigator.clipboard.writeText(code);
    setAppliedVoucherCode(code);
    router.push('/shop');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4" />
        <div className="h-10 bg-gray-200 animate-pulse rounded-md w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-36 border border-gray-150 p-6 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const getVouchersList = () => {
    if (activeTab === 'used') return used;
    if (activeTab === 'expired') return expired;
    return available;
  };

  const activeVouchersList = getVouchersList();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <h1 className="text-xl font-black text-[#101A2D] tracking-tight uppercase border-b border-gray-150 pb-4">
        {t('dashVouchers')}
      </h1>

      {/* Tabs Toggles */}
      <div className="flex border-b border-gray-150 bg-gray-50/50 rounded-lg overflow-hidden p-1 gap-1 max-w-md">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
            activeTab === 'active'
              ? 'bg-[#1A2A4A] text-white shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Available ({available.length})
        </button>
        <button
          onClick={() => setActiveTab('used')}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
            activeTab === 'used'
              ? 'bg-[#1A2A4A] text-white shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Used ({used.length})
        </button>
        <button
          onClick={() => setActiveTab('expired')}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
            activeTab === 'expired'
              ? 'bg-[#1A2A4A] text-white shadow-xs'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Expired ({expired.length})
        </button>
      </div>

      {/* List Grid */}
      {activeVouchersList.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-150 p-12 text-center text-xs text-gray-500 font-semibold max-w-md mx-auto">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          No vouchers found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeVouchersList.map((voucher) => {
            const isCopying = copiedCode === voucher.code;

            return (
              <div
                key={voucher._id}
                className={`bg-white rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all duration-150 relative overflow-hidden ${
                  activeTab === 'active'
                    ? 'border-gray-200 hover:border-gray-350 shadow-2xs'
                    : 'border-gray-150 bg-gray-50/50 opacity-70'
                }`}
              >
                {/* Left decorative tag circle */}
                <div className="absolute top-1/2 left-0 w-4 h-8 bg-[#F5F5F5] border border-gray-150 border-l-transparent rounded-r-full -translate-y-1/2 -translate-x-0.5" />
                {/* Right decorative tag circle */}
                <div className="absolute top-1/2 right-0 w-4 h-8 bg-[#F5F5F5] border border-gray-150 border-r-transparent rounded-l-full -translate-y-1/2 translate-x-0.5" />

                {/* Voucher Header Info */}
                <div className="space-y-2 pl-4 pr-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm tracking-wider">
                      {voucher.discountType === 'PERCENTAGE'
                        ? `${voucher.discountValue}% OFF`
                        : `$${voucher.discountValue} OFF`}
                    </span>
                    
                    {activeTab === 'active' && (
                      <button
                        onClick={() => handleCopyCode(voucher.code)}
                        className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#1A2A4A] hover:underline"
                        title="Copy Coupon Code"
                      >
                        {isCopying ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <h3 className="font-extrabold text-[#101A2D] text-base select-all">
                    {voucher.code}
                  </h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                    {voucher.description}
                  </p>
                </div>

                {/* Voucher Constraints Details */}
                <div className="pl-4 pr-4 border-t border-dashed border-gray-150 pt-3 text-[10px] text-gray-400 space-y-1 font-bold">
                  {voucher.minimumOrderValue > 0 && (
                    <p className="flex justify-between">
                      <span>Minimum Purchase:</span>
                      <span className="text-gray-600">${voucher.minimumOrderValue.toFixed(2)}</span>
                    </p>
                  )}
                  {voucher.categoryIds && voucher.categoryIds.length > 0 && (
                    <p className="flex justify-between">
                      <span>Applies to Category:</span>
                      <span className="text-gray-600 truncate max-w-[120px]">
                        {voucher.categoryIds.map((c) => c.name).join(', ')}
                      </span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span>{activeTab === 'active' ? 'Expires on:' : 'Expired on:'}</span>
                    <span className="text-gray-600">{formatDate(voucher.endDate)}</span>
                  </p>
                </div>

                {/* Call-to-action button */}
                {activeTab === 'active' && (
                  <div className="pl-4 pr-4">
                    <button
                      onClick={() => handleUseNow(voucher.code)}
                      className="w-full py-1.5 bg-[#1A2A4A] hover:bg-[#101A2D] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Use Coupon Now</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
