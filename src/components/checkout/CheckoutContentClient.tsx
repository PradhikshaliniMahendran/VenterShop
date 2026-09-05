'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/CartContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  MapPin,
  ClipboardList,
  CheckCircle,
  Truck,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ICalculationItem {
  productId: string;
  name: string;
  sku: string;
  image: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  subtotal: number;
  discount: number;
  total: number;
}

interface ICalculationResult {
  items: ICalculationItem[];
  subtotal: number;
  itemDiscounts: number;
  voucherDiscount: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  total: number;
  appliedVoucher: { code: string; discountAmount: number } | null;
  voucherError: string | null;
}

export default function CheckoutContentClient() {
  const { cart, clearCart, appliedVoucherCode } = useCart();
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();

  // Wizard Steps: 1 = Address, 2 = Review & Confirm, 3 = Success
  const [step, setStep] = useState(1);
  const [calcResult, setCalcResult] = useState<ICalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Shipping Address Fields State
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: 'Ontario',
    postalCode: '',
    phone: '',
  });

  // 1. Redirect if cart is empty (except when we are already in the success state)
  useEffect(() => {
    if (cart.length === 0 && step !== 3 && !loading) {
      router.push('/cart');
    }
  }, [cart, step, loading, router]);

  // Load default address from user profile if available
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
      setAddressForm({
        fullName: defaultAddr.fullName || '',
        email: user.email || '',
        addressLine1: defaultAddr.addressLine1 || '',
        addressLine2: defaultAddr.addressLine2 || '',
        city: defaultAddr.city || '',
        province: defaultAddr.province || 'Ontario',
        postalCode: defaultAddr.postalCode || '',
        phone: defaultAddr.phone || '',
      });
    } else if (user) {
      setAddressForm((prev) => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || prev.email,
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // 2. Fetch server-side pricing breakdown
  const fetchCheckoutTotals = useCallback(async () => {
    if (cart.length === 0) return;
    try {
      const res = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          voucherCode: appliedVoucherCode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCalcResult(data);
      }
    } catch (e) {
      console.error('Error fetching checkout totals:', e);
    } finally {
      setLoading(false);
    }
  }, [cart, appliedVoucherCode]);

  useEffect(() => {
    fetchCheckoutTotals();
  }, [fetchCheckoutTotals]);

  // Handle address form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(null);
  };

  const handleSelectSavedAddress = (addrId: string) => {
    if (!user || !user.addresses) return;
    const selected = user.addresses.find((a) => a._id === addrId);
    if (selected) {
      setAddressForm({
        fullName: selected.fullName,
        email: user.email || '',
        addressLine1: selected.addressLine1,
        addressLine2: selected.addressLine2 || '',
        city: selected.city,
        province: selected.province,
        postalCode: selected.postalCode,
        phone: selected.phone,
      });
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.email || !addressForm.addressLine1 || !addressForm.city || !addressForm.province || !addressForm.postalCode || !addressForm.phone) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  // 3. Place Order API trigger
  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          deliveryAddress: addressForm,
          voucherCode: appliedVoucherCode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPlacedOrderNumber(data.orderNumber);
        clearCart();
        setStep(3);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMsg(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  // 4. Loading indicator
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#801414] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-gray-500 font-bold">Preparing checkout session...</p>
      </div>
    );
  }

  // 5. STEP 3: SUCCESS STATE SCREEN
  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8 animate-fade-in text-xs font-semibold">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-200 mx-auto shadow-sm text-[#1B5E20]">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
            {t('checkoutSuccessTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto font-medium">
            Thank you! Your order details have been sent to <strong className="text-gray-900">{addressForm.email}</strong>.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm max-w-md mx-auto text-left space-y-3">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('checkoutOrderNumber')}</span>
            <span className="text-sm font-black text-[#801414]">{placedOrderNumber}</span>
          </div>
          <div className="space-y-2 text-xs">
            <p className="flex justify-between">
              <span className="text-gray-500">Order Status:</span>
              <span className="font-bold text-[#1B5E20]">CONFIRMED</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Payment:</span>
              <span className="font-bold text-amber-600">PENDING APPROVAL</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Delivery Address:</span>
              <span className="font-bold text-right text-gray-700 max-w-[200px] truncate block">
                {addressForm.addressLine1}, {addressForm.city}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link
            href="/dashboard/orders"
            className="py-3 px-8 bg-[#801414] hover:bg-[#630f0f] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all"
          >
            {language === 'ta' ? 'எனது ஆர்டர்களைக் காண்க' : 'View My Orders'}
          </Link>
          <Link
            href="/shop"
            className="py-3 px-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider rounded-lg border border-gray-200 transition-all"
          >
            {t('checkoutContinueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  const isFreeDelivery = calcResult ? calcResult.deliveryFee === 0 : false;

  // 6. WIZARD STEP HEADER
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-xs font-semibold">
      
      {/* Checkout step bar */}
      <div className="max-w-md mx-auto mb-8 flex items-center justify-between text-xs font-bold text-gray-400 select-none">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#801414]' : ''}`}>
          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
            step >= 1 ? 'bg-[#801414] text-white' : 'bg-gray-200 text-gray-500'
          }`}>1</span>
          <span>1. Shipping Address</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#801414]' : ''}`}>
          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
            step >= 2 ? 'bg-[#801414] text-white' : 'bg-gray-200 text-gray-500'
          }`}>2</span>
          <span>2. Review & Place Order</span>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-3xl mx-auto mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-xs font-bold flex gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: SHIPPING ADDRESS FORM */}
          {step === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h2 className="text-base font-serif font-black text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#801414]" />
                  Shipping Address
                </h2>
                
                {/* Saved Address Selection Dropdown */}
                {user && user.addresses && user.addresses.length > 0 && (
                  <select
                    onChange={(e) => handleSelectSavedAddress(e.target.value)}
                    defaultValue=""
                    className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 font-semibold text-xs text-gray-800 focus:bg-white focus:border-[#801414] outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select Saved Address</option>
                    {user.addresses.map((addr, idx) => (
                      <option key={addr._id || idx} value={addr._id}>
                        {addr.fullName} - {addr.addressLine1} ({addr.addressType})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <form onSubmit={handleNextStep} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={addressForm.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-semibold"
                  />
                </div>

                {/* Email for Order Receipt */}
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold">Email (for Order Confirmation) *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="customer@example.com"
                    value={addressForm.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-semibold"
                  />
                </div>

                {/* Address Line 1 */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-gray-700 font-bold">Street Address *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={addressForm.addressLine1}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-semibold"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-gray-700 font-bold">Apartment, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={addressForm.addressLine2}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-semibold"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={addressForm.city}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-semibold"
                  />
                </div>

                {/* Province */}
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold">Province *</label>
                  <select
                    name="province"
                    value={addressForm.province}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-semibold"
                  >
                    <option value="Ontario">Ontario</option>
                    <option value="Quebec">Quebec</option>
                    <option value="British Columbia">British Columbia</option>
                    <option value="Alberta">Alberta</option>
                    <option value="Manitoba">Manitoba</option>
                    <option value="Saskatchewan">Saskatchewan</option>
                    <option value="Nova Scotia">Nova Scotia</option>
                    <option value="New Brunswick">New Brunswick</option>
                    <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                    <option value="Prince Edward Island">Prince Edward Island</option>
                  </select>
                </div>

                {/* Postal Code */}
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    placeholder="e.g. M5V 2T6"
                    value={addressForm.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-semibold"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+1 (416) 555-0199"
                    value={addressForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-semibold"
                  />
                </div>

                {/* Next Step Button */}
                <div className="sm:col-span-2 pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all"
                  >
                    <span>Continue to Order Review</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: REVIEW & CONFIRM */}
          {step === 2 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-base font-serif font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <ClipboardList className="w-4 h-4 text-[#801414]" />
                Review Your Order
              </h2>

              {/* Delivery Address Summary */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1 text-xs">
                <p className="font-bold text-gray-900">Shipping to:</p>
                <p className="font-semibold text-gray-700">{addressForm.fullName} ({addressForm.phone})</p>
                <p className="text-gray-600">{addressForm.addressLine1} {addressForm.addressLine2}</p>
                <p className="text-gray-600">{addressForm.city}, {addressForm.province} {addressForm.postalCode}</p>
                <p className="text-gray-600">Confirmation email: <strong className="text-gray-900">{addressForm.email}</strong></p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Cart Items ({calcResult?.items.length})
                </h3>
                {calcResult && (
                  <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto pr-2">
                    {calcResult.items.map((item) => (
                      <div key={item.productId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 bg-cover bg-center rounded-md border border-gray-200 shrink-0 bg-gray-50"
                            style={{ backgroundImage: `url('${item.image || '/images/hero_banner.png'}')` }}
                          />
                          <div>
                            <p className="text-gray-900 font-bold line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-gray-500">Qty: {item.quantity} • ${item.finalPrice.toFixed(2)}/unit</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-600 hover:text-black font-bold uppercase py-2"
                  disabled={placingOrder}
                >
                  ← Edit Address
                </button>
                
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full sm:w-auto h-12 flex items-center justify-center gap-2 bg-[#801414] hover:bg-[#630f0f] text-white font-bold text-xs uppercase tracking-wider px-8 rounded-lg shadow-md disabled:bg-gray-400 transition-all cursor-pointer"
                >
                  <span>{placingOrder ? 'Placing Order...' : 'Place Order Now'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Column: Order Totals Recap panel */}
        {calcResult && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Order Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900">${calcResult.subtotal.toFixed(2)}</span>
              </div>
              
              {calcResult.itemDiscounts > 0 && (
                <div className="flex justify-between text-[#1B5E20] font-bold">
                  <span>Offers Savings</span>
                  <span>-${calcResult.itemDiscounts.toFixed(2)}</span>
                </div>
              )}

              {calcResult.voucherDiscount > 0 && (
                <div className="flex justify-between text-[#1B5E20] font-bold">
                  <span>Voucher Savings ({calcResult.appliedVoucher?.code})</span>
                  <span>-${calcResult.voucherDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 font-medium">
                <span>Delivery Fee</span>
                <span className="font-bold">
                  {isFreeDelivery ? (
                    <span className="text-[#1B5E20] font-bold">FREE ($0.00)</span>
                  ) : (
                    `$${calcResult.deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {/* Delivery info notice */}
              <div className={`p-2.5 rounded-lg text-[10px] font-medium ${
                isFreeDelivery
                  ? 'bg-green-50 text-green-900 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {isFreeDelivery
                  ? '🚚 Free Delivery applied (Orders over $75)'
                  : '🚚 Standard Delivery ($12.50). Orders over $75 get Free Delivery.'}
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                <span className="text-sm font-black text-gray-900">{t('cartTotal')}</span>
                <span className="text-2xl font-serif font-black text-[#801414]">
                  ${calcResult.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Security disclaimer */}
            <div className="text-[10px] text-gray-400 leading-normal flex items-start gap-1.5 border-t border-gray-100 pt-4">
              <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <span>100% Secure Checkout. Confirmation receipt is delivered directly to your customer email.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
