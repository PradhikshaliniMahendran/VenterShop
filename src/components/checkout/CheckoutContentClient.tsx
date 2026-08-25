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
  Info,
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
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
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
        addressLine1: defaultAddr.addressLine1 || '',
        addressLine2: defaultAddr.addressLine2 || '',
        city: defaultAddr.city || '',
        province: defaultAddr.province || '',
        postalCode: defaultAddr.postalCode || '',
        phone: defaultAddr.phone || '',
      });
    } else if (user) {
      setAddressForm((prev) => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
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
    if (!addressForm.fullName || !addressForm.addressLine1 || !addressForm.city || !addressForm.province || !addressForm.postalCode || !addressForm.phone) {
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
        // Trigger success confetti
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#1A2A4A] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-sm text-gray-500 font-semibold">Preparing checkout session...</p>
      </div>
    );
  }

  // 5. STEP 3: SUCCESS STATE SCREEN
  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 mx-auto shadow-sm text-emerald-600">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-[#101A2D]">
            {t('checkoutSuccessTitle')}
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            {t('checkoutSuccessSubtitle')}
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm max-w-md mx-auto text-left space-y-4">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('checkoutOrderNumber')}</span>
            <span className="text-sm font-black text-[#1A2A4A]">{placedOrderNumber}</span>
          </div>
          <div className="space-y-2 text-xs">
            <p className="flex justify-between">
              <span className="text-gray-500">Fulfillment Status:</span>
              <span className="font-extrabold text-[#1A2A4A]">PENDING</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Payment Status:</span>
              <span className="font-extrabold text-amber-600">PENDING</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Delivery Address:</span>
              <span className="font-bold text-right text-gray-700 max-w-[200px] truncate block">
                {addressForm.addressLine1}, {addressForm.city}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/dashboard/orders"
            className="py-2.5 px-8 bg-[#1A2A4A] hover:bg-[#101A2D] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all"
          >
            {language === 'ta' ? 'எனது ஆர்டர்களைக் காண்க' : 'View My Orders'}
          </Link>
          <Link
            href="/shop"
            className="py-2.5 px-8 bg-gray-100 hover:bg-gray-250 text-[#333333] font-bold text-xs uppercase tracking-wider rounded-lg border border-gray-200 transition-all"
          >
            {t('checkoutContinueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  // 6. WIZARD STEP HEADER
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Checkout step bar */}
      <div className="max-w-xl mx-auto mb-10 flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-400 select-none">
        <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#1A2A4A] font-extrabold' : ''}`}>
          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
            step >= 1 ? 'bg-[#1A2A4A] text-white' : 'bg-gray-200 text-gray-500'
          }`}>1</span>
          <span>{t('checkoutStepsAddress')}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#1A2A4A] font-extrabold' : ''}`}>
          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
            step >= 2 ? 'bg-[#1A2A4A] text-white' : 'bg-gray-200 text-gray-500'
          }`}>2</span>
          <span>{t('checkoutStepsSummary')}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-3xl mx-auto mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-155 text-xs font-extrabold flex gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: SHIPPING ADDRESS FORM */}
          {step === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h2 className="text-lg font-black text-[#1A2A4A] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#E53935]" />
                  {t('checkoutStepsAddress')}
                </h2>
                
                {/* Saved Address Selection Dropdown */}
                {user && user.addresses && user.addresses.length > 0 && (
                  <select
                    onChange={(e) => handleSelectSavedAddress(e.target.value)}
                    defaultValue=""
                    className="bg-[#F5F5F5] border border-transparent rounded-lg py-1.5 px-3 font-semibold text-xs text-[#333333] focus:bg-white focus:border-[#1A2A4A] outline-none cursor-pointer"
                  >
                    <option value="" disabled>{t('checkoutSelectAddress')}</option>
                    {user.addresses.map((addr, idx) => (
                      <option key={addr._id || idx} value={addr._id}>
                        {addr.fullName} - {addr.addressLine1} ({addr.addressType})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <form onSubmit={handleNextStep} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                
                {/* Full name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[#333333] font-bold">{t('checkoutFullName')} *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={addressForm.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>

                {/* Address Line 1 */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[#333333] font-bold">{t('checkoutAddress1')} *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={addressForm.addressLine1}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[#333333] font-bold">{t('checkoutAddress2')}</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={addressForm.addressLine2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-[#333333] font-bold">{t('checkoutCity')} *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={addressForm.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>

                {/* Province */}
                <div className="space-y-1.5">
                  <label className="text-[#333333] font-bold">{t('checkoutProvince')} *</label>
                  <select
                    name="province"
                    required
                    value={addressForm.province}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] cursor-pointer text-gray-900 font-bold"
                  >
                    <option value="">Select Province</option>
                    <option value="Alberta">Alberta</option>
                    <option value="British Columbia">British Columbia</option>
                    <option value="Manitoba">Manitoba</option>
                    <option value="New Brunswick">New Brunswick</option>
                    <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                    <option value="Nova Scotia">Nova Scotia</option>
                    <option value="Ontario">Ontario</option>
                    <option value="Prince Edward Island">Prince Edward Island</option>
                    <option value="Quebec">Quebec</option>
                    <option value="Saskatchewan">Saskatchewan</option>
                    <option value="Northwest Territories">Northwest Territories</option>
                    <option value="Nunavut">Nunavut</option>
                    <option value="Yukon">Yukon</option>
                  </select>
                </div>

                {/* Postal Code */}
                <div className="space-y-1.5">
                  <label className="text-[#333333] font-bold">{t('checkoutPostalCode')} *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={addressForm.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[#333333] font-bold">{t('checkoutPhone')} *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/[^0-9+\s()-]/g, '') })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold"
                  />
                </div>

                {/* Step button */}
                <div className="sm:col-span-2 pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto h-11 flex items-center justify-center gap-2 bg-[#1A2A4A] hover:bg-[#101A2D] text-white font-bold text-xs uppercase tracking-wider px-8 rounded-lg shadow-sm"
                  >
                    <span>Continue to Order Review</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: REVIEW ORDER DETAILS & DISPATCH */}
          {step === 2 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-150 shadow-xs space-y-6">
              <h2 className="text-lg font-black text-[#1A2A4A] flex items-center gap-2 border-b border-gray-100 pb-3">
                <ClipboardList className="w-5 h-5 text-[#E53935]" />
                Review Your Order
              </h2>

              {/* Address Review summary */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-[#101A2D]">Shipping Destination</h4>
                  <p className="text-gray-600">
                    <strong>{addressForm.fullName}</strong><br />
                    {addressForm.addressLine1}{addressForm.addressLine2 ? `, ${addressForm.addressLine2}` : ''}<br />
                    {addressForm.city}, {addressForm.province} {addressForm.postalCode}<br />
                    Phone: {addressForm.phone}
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#E53935] hover:text-[#c62828] font-bold uppercase tracking-wider hover:underline"
                  disabled={placingOrder}
                >
                  Edit Address
                </button>
              </div>

              {/* Items Summary list */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-extrabold text-[#101A2D] uppercase tracking-wider">Purchased Items</h4>
                {calcResult && (
                  <div className="divide-y divide-gray-100">
                    {calcResult.items.map((item) => (
                      <div key={item.productId} className="py-3 flex justify-between items-center gap-4 text-xs font-semibold">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 bg-cover bg-center rounded-md border border-gray-200 shrink-0 bg-gray-50"
                            style={{ backgroundImage: `url('${item.image || '/images/hero_banner.png'}')` }}
                          />
                          <div>
                            <p className="text-[#101A2D] line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-gray-400">Qty: {item.quantity} • ${item.finalPrice.toFixed(2)}/unit</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#101A2D]">${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Place Order Trigger CTA */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-black font-extrabold uppercase tracking-wider py-2"
                  disabled={placingOrder}
                >
                  ← Back to Shipping Address
                </button>
                
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full sm:w-auto h-12 flex items-center justify-center gap-2 bg-[#E53935] hover:bg-[#c62828] text-white font-bold text-xs uppercase tracking-wider px-8 rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  <span>{placingOrder ? t('checkoutPlacingOrder') : t('checkoutPlaceOrder')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Column: Order Totals Recap panel */}
        {calcResult && (
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-6">
            <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider border-b border-gray-100 pb-3">
              Order Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#333333]">${calcResult.subtotal.toFixed(2)}</span>
              </div>
              
              {calcResult.itemDiscounts > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Offers Savings</span>
                  <span>-${calcResult.itemDiscounts.toFixed(2)}</span>
                </div>
              )}

              {calcResult.voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-extrabold">
                  <span>Voucher Savings ({calcResult.appliedVoucher?.code})</span>
                  <span>-${calcResult.voucherDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>Shipping Fees</span>
                <span className="font-bold text-[#333333]">
                  {calcResult.deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-extrabold">FREE</span>
                  ) : (
                    `$${calcResult.deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {calcResult.deliveryFee > 0 && (
                <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-lg p-2.5 leading-normal text-[10px]">
                  💡 <strong>Tip:</strong> Free shipping unlocked on orders over ${calcResult.freeDeliveryThreshold}. Add more products to unlock.
                </div>
              )}

              <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                <span className="text-sm font-extrabold text-[#101A2D]">{t('cartTotal')}</span>
                <span className="text-2xl font-black text-[#1A2A4A]">${calcResult.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Voucher Coupon input on Checkout */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <label className="text-xs font-extrabold text-[#101A2D] block">Voucher / Coupon Code</label>
              {calcResult.appliedVoucher ? (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold block">CODE: {calcResult.appliedVoucher.code}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Saved ${calcResult.appliedVoucher.discountAmount.toFixed(2)}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">APPLIED</span>
                </div>
              ) : (
                <p className="text-[11px] text-gray-500 font-semibold">
                  Coupons can be managed in your <Link href="/cart" className="text-[#1A2A4A] font-bold underline">Cart</Link> or applied prior to order review.
                </p>
              )}
            </div>

            {/* Security disclaimer */}
            <div className="text-[10px] text-gray-400 leading-normal flex items-start gap-1.5 border-t border-gray-100 pt-4">
              <ShieldCheck className="w-4 h-4 text-[#1A2A4A] shrink-0 mt-0.5" />
              <span>Payments are decoupled in our secure sandboxed environment. Placed orders are registered with a PENDING payment status for admin approval.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
