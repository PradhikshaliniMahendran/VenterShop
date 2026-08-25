'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Briefcase,
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface IStatsMetrics {
  totalRevenue: number;
  activeOrders: number;
  totalCustomers: number;
  pendingWholesale: number;
}

interface ILowStockProduct {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
}

interface IRecentOrder {
  _id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  createdAt: string;
}

interface IRecentB2BApp {
  _id: string;
  businessName: string;
  contactPerson: string;
  status: string;
  expectedOrderVolume: string;
}

export default function AdminOverviewDashboard() {
  const [metrics, setMetrics] = useState<IStatsMetrics | null>(null);
  const [lowStock, setLowStock] = useState<ILowStockProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<IRecentOrder[]>([]);
  const [recentB2B, setRecentB2B] = useState<IRecentB2BApp[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin dashboard info
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setLowStock(data.lowStockAlerts || []);
          setRecentOrders(data.recentOrders || []);
          setRecentB2B(data.recentB2BApplications || []);
        }
      } catch (e) {
        console.error('Failed to load admin stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getOrderStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 animate-pulse rounded-md w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-24 border border-gray-150 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl h-96 border border-gray-150 animate-pulse" />
          <div className="bg-white rounded-xl h-96 border border-gray-150 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[#101A2D] tracking-tight uppercase flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#E53935]" />
          Operations Overview
        </h1>
        <p className="text-xs text-gray-500 font-bold mt-1">
          Back-Office Statistics and Administration Console
        </p>
      </div>

      {/* Stats KPI Grid */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-2xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Sales Revenue</p>
              <h4 className="text-xl font-black text-[#101A2D]">${metrics.totalRevenue.toFixed(2)}</h4>
            </div>
          </div>

          {/* Active Orders */}
          <Link
            href="/admin/orders"
            className="bg-white p-5 rounded-xl border border-gray-150 shadow-2xs flex items-center gap-4 hover:border-[#1A2A4A]/20 transition-colors"
          >
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Open Orders</p>
              <h4 className="text-xl font-black text-[#101A2D]">{metrics.activeOrders}</h4>
            </div>
          </Link>

          {/* Customers */}
          <Link
            href="/admin/customers"
            className="bg-white p-5 rounded-xl border border-gray-150 shadow-2xs flex items-center gap-4 hover:border-[#1A2A4A]/20 transition-colors"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Registered Clients</p>
              <h4 className="text-xl font-black text-[#101A2D]">{metrics.totalCustomers}</h4>
            </div>
          </Link>

          {/* Pending B2B Apps */}
          <Link
            href="/admin/customers"
            className="bg-white p-5 rounded-xl border border-gray-150 shadow-2xs flex items-center gap-4 hover:border-[#E53935]/25 transition-colors"
          >
            <div className="p-3 bg-red-50 text-[#E53935] rounded-lg border border-red-100 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">B2B Applications</p>
              <h4 className="text-xl font-black text-[#101A2D]">{metrics.pendingWholesale}</h4>
            </div>
          </Link>
        </div>
      )}

      {/* Split Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Low Stock & B2B Apps */}
        <div className="space-y-8">
          {/* Low Stock Alerts Card */}
          <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-extrabold text-xs text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Low Stock Inventory Alerts
              </h3>
              <Link
                href="/admin/products"
                className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
              >
                <span>Manage Stock</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {lowStock.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                All product stock balances remain above triggers.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {lowStock.map((prod) => (
                  <div key={prod._id} className="p-4 flex justify-between items-center text-xs font-semibold">
                    <div>
                      <p className="text-[#101A2D] font-bold">{prod.name}</p>
                      <p className="text-[10px] text-gray-400">SKU: {prod.sku}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-red-50 text-[#E53935] border border-red-100 font-extrabold px-2.5 py-0.5 rounded-sm">
                        Stock: {prod.stock} / Trigger: {prod.lowStockThreshold}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* B2B Wholesale Applications */}
          <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-extrabold text-xs text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-gray-400" />
                Pending B2B Applications
              </h3>
              <Link
                href="/admin/customers"
                className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
              >
                <span>Approve Wholesale</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentB2B.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 font-semibold">
                No wholesale applications currently submitted.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentB2B.map((app) => (
                  <div key={app._id} className="p-4 flex justify-between items-center text-xs font-semibold">
                    <div>
                      <p className="text-[#101A2D] font-bold">{app.businessName}</p>
                      <p className="text-[10px] text-gray-400">Contact: {app.contactPerson} • Vol: {app.expectedOrderVolume}</p>
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 border text-[9px] font-extrabold uppercase rounded-full ${
                        app.status === 'PENDING' ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-emerald-700 bg-emerald-50 border-emerald-100'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden h-fit">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-extrabold text-xs text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              Recent Operations Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
            >
              <span>See All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 font-semibold">
              No orders registered in the system yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div key={order._id} className="p-4 flex justify-between items-center text-xs font-semibold hover:bg-gray-50">
                  <div className="space-y-0.5">
                    <p className="text-[#1A2A4A] font-bold">{order.orderNumber}</p>
                    <p className="text-[10px] text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[#101A2D] font-bold">${order.total.toFixed(2)}</span>
                    <span className={`inline-block px-2 py-0.5 border text-[9px] font-extrabold uppercase rounded-full ${getOrderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
