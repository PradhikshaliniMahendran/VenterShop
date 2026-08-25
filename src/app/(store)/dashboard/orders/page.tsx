'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import {
  ShoppingBag,
  Printer,
  RotateCcw,
  CheckCircle,
  Truck,
  PackageCheck,
  CreditCard,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface IOrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
}

interface IOrderAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
}

interface IOrderData {
  _id: string;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  voucherCode?: string;
  deliveryAddress: IOrderAddress;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

function OrdersPageContent() {
  const { t, language } = useTranslation();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<IOrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 1. Fetch Orders List
  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/customer/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
          
          // Auto-expand if order ID passed in URL search params (e.g. from redirect)
          const targetId = searchParams.get('id');
          if (targetId) {
            setExpandedId(targetId);
          }
        }
      } catch (e) {
        console.error('Failed to fetch orders:', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [searchParams]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 2. Re-Order action
  const handleReorder = (items: IOrderItem[]) => {
    items.forEach((item) => {
      addToCart(item.productId, item.quantity);
    });
    // Redirect to cart
    window.location.href = '/cart';
  };

  // 3. Print Invoice helper
  const handlePrintInvoice = (order: IOrderData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let itemsRows = '';
    order.items.forEach((item) => {
      itemsRows += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name} (${item.sku})</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.total.toFixed(2)}</td>
        </tr>
      `;
    });

    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice #${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #1a2a4a; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: 900; color: #1a2a4a; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #f3f4f6; color: #1a2a4a; padding: 10px; text-align: left; }
            .totals { width: 300px; margin-left: auto; font-size: 14px; }
            .totals td { padding: 5px 0; }
            .footer { border-top: 1px solid #ddd; padding-top: 20px; margin-top: 50px; text-align: center; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">VENTERSHOP</div>
            <p style="margin: 5px 0 0; color: #E53935; font-weight: bold; font-size: 13px;">Your Trusted Online Store for Quality Products</p>
          </div>
          <div class="meta">
            <div>
              <h3>INVOICE</h3>
              <p><strong>Order ID:</strong> #${order.orderNumber}</p>
              <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
              <p><strong>Fulfillment Status:</strong> ${order.orderStatus}</p>
            </div>
            <div>
              <h3>Shipping Destination</h3>
              <p><strong>${order.deliveryAddress.fullName}</strong></p>
              <p>${order.deliveryAddress.addressLine1}</p>
              ${order.deliveryAddress.addressLine2 ? `<p>${order.deliveryAddress.addressLine2}</p>` : ''}
              <p>${order.deliveryAddress.city}, ${order.deliveryAddress.province} ${order.deliveryAddress.postalCode}</p>
              <p>Phone: ${order.deliveryAddress.phone}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
          <div class="totals">
            <table style="margin: 0; width: 100%;">
              <tr>
                <td style="color: #6b7280;">Subtotal:</td>
                <td style="text-align: right;">$${order.subtotal.toFixed(2)}</td>
              </tr>
              ${order.discount > 0 ? `<tr>
                <td style="color: #16803C;">Discount:</td>
                <td style="text-align: right; color: #16803C;">-$${order.discount.toFixed(2)}</td>
              </tr>` : ''}
              <tr>
                <td style="color: #6b7280;">Shipping:</td>
                <td style="text-align: right;">${order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}</td>
              </tr>
              <tr style="font-weight: bold; border-top: 1.5px solid #1a2a4a;">
                <td style="padding-top: 10px;">Total:</td>
                <td style="text-align: right; padding-top: 10px;">$${order.total.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <p>Thank you for shopping with VENTERSHOP Canada.</p>
            <p>© 2026 VENTERSHOP Canada. All rights reserved.</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  // 4. Fulfillment Tracking Timeline builder
  const renderTrackingTimeline = (status: string) => {
    const steps = [
      { key: 'PENDING', label: 'Placed' },
      { key: 'CONFIRMED', label: 'Confirmed' },
      { key: 'PROCESSING', label: 'Processing' },
      { key: 'SHIPPED', label: 'Shipped' },
      { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
      { key: 'DELIVERED', label: 'Delivered' },
    ];

    if (status === 'CANCELLED') {
      return (
        <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider">
          ⚠️ This order has been CANCELLED.
        </div>
      );
    }

    // Determine highest active index
    const activeIndex = steps.findIndex((step) => step.key === status);

    return (
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-gray-400" />
          Fulfillment Journey
        </h4>
        
        <div className="relative flex flex-row items-center justify-between py-4 select-none">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 z-0" />
          {/* Active Connecting Line overlay */}
          {activeIndex >= 0 && (
            <div
              className="absolute top-1/2 left-4 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${(activeIndex / (steps.length - 1)) * 100}%`,
                // Account for padding margins
                maxWidth: 'calc(100% - 32px)',
              }}
            />
          )}

          {/* Steps */}
          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-emerald-50 scale-110' : ''}`}
                >
                  {isCompleted && idx < activeIndex ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-black">{idx + 1}</span>
                  )}
                </div>
                {/* Step Label */}
                <span className={`text-[10px] sm:text-xs font-bold text-center leading-tight max-w-[80px] truncate ${
                  isCurrent ? 'text-emerald-700 font-extrabold' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getStatusColorBadge = (status: string) => {
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
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl h-20 border border-gray-150 p-4 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-black text-[#101A2D] tracking-tight uppercase border-b border-gray-150 pb-4">
        {t('dashOrders')}
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-150 p-12 text-center text-xs text-gray-500 font-semibold max-w-md mx-auto">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          You haven't placed any purchases yet. Click below to explore our products.
          <Link
            href="/shop"
            className="block py-2 px-6 bg-[#1A2A4A] text-white rounded-lg font-bold mt-4 max-w-xs mx-auto hover:bg-[#101A2D]"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order._id;

            return (
              <div
                key={order._id}
                className={`bg-white rounded-xl border overflow-hidden transition-all duration-200 ${
                  isExpanded ? 'border-[#1A2A4A] shadow-xs' : 'border-gray-150 hover:border-gray-200'
                }`}
              >
                {/* Header Strip */}
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="w-full p-4 sm:p-5 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order ID</p>
                      <p className="font-extrabold text-[#1A2A4A] text-sm">{order.orderNumber}</p>
                    </div>
                    <div className="border-l border-gray-200 pl-4">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date Placed</p>
                      <p className="font-semibold text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="border-l border-gray-200 pl-4">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total amount</p>
                      <p className="font-extrabold text-[#101A2D] text-sm">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                    <span className={`inline-block px-2.5 py-0.5 border text-[10px] font-extrabold uppercase rounded-full ${getStatusColorBadge(order.orderStatus)}`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Collapsible Details Drawer */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-gray-100 space-y-6 animate-fade-in">
                    
                    {/* 1. Fulfillment Tracking timeline slider */}
                    {renderTrackingTimeline(order.orderStatus)}

                    {/* 2. Purchased Items Grid */}
                    <div className="space-y-3 border-t border-gray-100 pt-5">
                      <h4 className="text-xs font-extrabold text-[#101A2D] uppercase tracking-wider flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        Purchased Items Summary
                      </h4>
                      <div className="divide-y divide-gray-100">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between items-center text-xs font-semibold">
                            <div>
                              <p className="text-[#101A2D]">{item.name}</p>
                              <p className="text-[10px] text-gray-400">SKU: {item.sku} • Qty: {item.quantity} • ${item.price.toFixed(2)}/unit</p>
                            </div>
                            <span className="font-bold text-[#101A2D]">${item.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. Address and payment layout details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-5 text-xs font-semibold">
                      
                      {/* Left: Address Block */}
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-[#101A2D] uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          Shipping Address
                        </h4>
                        <p className="text-gray-500 leading-normal">
                          <strong>{order.deliveryAddress.fullName}</strong><br />
                          {order.deliveryAddress.addressLine1}{order.deliveryAddress.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ''}<br />
                          {order.deliveryAddress.city}, {order.deliveryAddress.province} {order.deliveryAddress.postalCode}<br />
                          Phone: {order.deliveryAddress.phone}
                        </p>
                      </div>

                      {/* Right: Payments and Totals Block */}
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-[#101A2D] uppercase tracking-wider flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                          Payment & Billing
                        </h4>
                        
                        <div className="space-y-1.5 text-gray-500">
                          <p className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="text-[#333333]">${order.subtotal.toFixed(2)}</span>
                          </p>
                          {order.discount > 0 && (
                            <p className="flex justify-between text-emerald-700">
                              <span>Discounts:</span>
                              <span>-${order.discount.toFixed(2)}</span>
                            </p>
                          )}
                          <p className="flex justify-between">
                            <span>Shipping & Delivery:</span>
                            <span className="text-[#333333]">{order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}</span>
                          </p>
                          <p className="flex justify-between border-t border-gray-150 pt-2 font-bold text-sm text-[#1A2A4A]">
                            <span>Final Total:</span>
                            <span>${order.total.toFixed(2)}</span>
                          </p>
                          <p className="flex justify-between text-[10px] font-bold text-gray-400 pt-1.5 uppercase tracking-wide">
                            <span>Payment Status:</span>
                            <span className={order.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-600'}>
                              {order.paymentStatus}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 4. Action bar */}
                    <div className="border-t border-gray-100 pt-5 flex justify-end gap-3 text-xs">
                      <button
                        onClick={() => handlePrintInvoice(order)}
                        className="flex items-center gap-1.5 py-2 px-4 border border-gray-300 hover:bg-gray-50 text-[#333333] rounded-lg font-bold transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>

                      {order.orderStatus !== 'CANCELLED' && (
                        <button
                          onClick={() => handleReorder(order.items)}
                          className="flex items-center gap-1.5 py-2 px-4 bg-[#1A2A4A] hover:bg-[#101A2D] text-white rounded-lg font-bold shadow-xs transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Re-Order Items</span>
                        </button>
                      )}
                    </div>

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

export default function DashboardOrdersPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4 animate-pulse text-xs font-semibold">
        <div className="h-8 bg-gray-200 rounded-md w-1/4" />
        <div className="bg-white rounded-xl h-20 border border-gray-150 p-4" />
      </div>
    }>
      <OrdersPageContent />
    </Suspense>
  );
}
