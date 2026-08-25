'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  ShoppingBag,
  RefreshCw,
  Sparkles,
  Ticket,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
} from 'lucide-react';

interface IOrderSummary {
  _id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  createdAt: string;
}

interface IStatsData {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalSavings: number;
  availableVouchers: number;
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();

  const [stats, setStats] = useState<IStatsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<IOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/customer/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentOrders(data.recentOrders);
        }
      } catch (e) {
        console.error('Failed to load dashboard stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 animate-pulse rounded-md w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-24 border border-gray-100 p-4 animate-pulse" />
          ))}
        </div>
        <div className="bg-white rounded-xl h-64 border border-gray-100 p-6 animate-pulse" />
      </div>
    );
  }

  // Format Date Helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'CANCELLED':
        return 'text-red-700 bg-red-50 border-red-100';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'text-sky-700 bg-sky-50 border-sky-100';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-100';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Tailored Segment Welcome Banner */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-150 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#101A2D] tracking-tight">
                {t('dashWelcome')}, {user.firstName}!
              </h1>
              <span
                className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border tracking-wider ${
                  user.customerType === 'WHOLESALE'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : user.customerType === 'COMMUNITY'
                    ? 'bg-red-50 text-[#E53935] border-red-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {user.customerType === 'WHOLESALE'
                  ? 'B2B Wholesale Account'
                  : user.customerType === 'COMMUNITY'
                  ? 'Community Group Member'
                  : 'Retail Customer'}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-semibold">
              {user.customerType === 'WHOLESALE'
                ? 'Welcome to your commercial wholesale portal. Exclusive bulk prices and quantity tiers are active on all items.'
                : user.customerType === 'COMMUNITY'
                ? 'Welcome back! Your community group discounts and targeted promotional vouchers are active.'
                : 'Registered Customer Profile. Connect with a community group or apply for B2B status to unlock discounts.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {user.customerType === 'NORMAL' && (
              <>
                <Link
                  href="/#community"
                  className="px-3.5 py-2 bg-[#E53935] hover:bg-[#c62828] text-white rounded-lg text-xs font-bold uppercase transition-colors shadow-2xs"
                >
                  Join Community
                </Link>
                <Link
                  href="/dashboard/wholesale"
                  className="px-3.5 py-2 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg text-xs font-bold uppercase transition-colors shadow-2xs"
                >
                  Apply B2B Wholesale
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Stats Grid Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Orders */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-gray-50 text-[#1A2A4A] rounded-lg border border-gray-150 shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('dashTotalOrders')}</p>
              <h4 className="text-xl font-black text-[#101A2D]">{stats.totalOrders}</h4>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-gray-50 text-[#1A2A4A] rounded-lg border border-gray-150 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('dashActiveOrders')}</p>
              <h4 className="text-xl font-black text-[#101A2D]">{stats.activeOrders}</h4>
            </div>
          </div>

          {/* Available Vouchers */}
          <Link
            href="/dashboard/vouchers"
            className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center gap-4 hover:border-[#1A2A4A]/25 transition-colors"
          >
            <div className="p-3 bg-red-50 text-[#E53935] rounded-lg border border-red-100 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('dashVoucherWallet')}</p>
              <h4 className="text-xl font-black text-[#101A2D]">{stats.availableVouchers}</h4>
            </div>
          </Link>

          {/* Total Savings */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('dashTotalSavings')}</p>
              <h4 className="text-xl font-black text-emerald-700">${stats.totalSavings.toFixed(2)}</h4>
            </div>
          </div>
        </div>
      )}

      {/* 3. Account Tier Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Community Panel */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#E53935] rounded-full" />
              Community Program
            </h3>
            {user.customerType === 'COMMUNITY' ? (
              <p className="text-xs text-gray-500 leading-relaxed">
                You are registered as a <strong>Community Member</strong>. Localized discount prices are applied to your products catalog automatically.
              </p>
            ) : (
              <p className="text-xs text-gray-500 leading-relaxed">
                Unlock targeted groceries discounts and community vouchers by requesting assignment to a local community group.
              </p>
            )}
          </div>
          <Link
            href="/dashboard/community"
            className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
          >
            <span>{user.customerType === 'COMMUNITY' ? 'View My Community Benefits' : 'Learn More & Connect'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Wholesale Panel */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#E53935] rounded-full" />
              Wholesale Solutions
            </h3>
            {user.customerType === 'WHOLESALE' ? (
              <p className="text-xs text-gray-500 leading-relaxed">
                Your B2B Wholesale account is active. You can browse wholesale-specific products and take advantage of bulk pricing tiers.
              </p>
            ) : (
              <p className="text-xs text-gray-500 leading-relaxed">
                Running a retail store or business? Apply for a B2B account to unlock bulk pricing models and customized wholesale shipping.
              </p>
            )}
          </div>
          <Link
            href="/dashboard/wholesale"
            className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
          >
            <span>{user.customerType === 'WHOLESALE' ? 'View B2B Benefits' : 'Apply for Wholesale Account'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            {t('dashRecentOrders')}
          </h3>
          <Link
            href="/dashboard/orders"
            className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
          >
            <span>See All Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 font-semibold">
            You haven't placed any orders yet. Once you make purchases, they will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-500 uppercase font-bold border-b border-gray-150">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date Placed</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 font-semibold text-gray-700">
                    <td className="p-4 font-bold text-[#1A2A4A]">{order.orderNumber}</td>
                    <td className="p-4 text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="p-4 font-bold text-[#101A2D]">${order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 border text-[10px] font-extrabold uppercase rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/dashboard/orders?id=${order._id}`}
                        className="text-xs font-bold text-[#E53935] hover:underline"
                      >
                        Track Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
