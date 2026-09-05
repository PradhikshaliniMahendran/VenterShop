'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/CartContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Percent,
  Truck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

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
  appliedOfferName?: string;
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

export default function CartContentClient() {
  const { cart, updateQuantity, removeFromCart, appliedVoucherCode, setAppliedVoucherCode } = useCart();
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();

  const [calcResult, setCalcResult] = useState<ICalculationResult | null>(null);
  const [voucherInput, setVoucherInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyingVoucher, setApplyingVoucher] = useState(false);
  const [voucherErrorMsg, setVoucherErrorMsg] = useState<string | null>(null);

  // Sync input value with active voucher code
  useEffect(() => {
    if (appliedVoucherCode) {
      setVoucherInput(appliedVoucherCode);
    }
  }, [appliedVoucherCode]);

  // 1. Core Calculator fetch caller
  const calculateCartTotals = useCallback(async () => {
    if (cart.length === 0) {
      setCalcResult(null);
      setLoading(false);
      return;
    }

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
        
        // Auto-purge stale or deleted items from cart state
        if (data.items) {
          const returnedValidIds = new Set(data.items.map((i: any) => i.productId));
          const staleItems = cart.filter((ci) => !returnedValidIds.has(ci.productId));
          if (staleItems.length > 0) {
            staleItems.forEach((stale) => removeFromCart(stale.productId));
          }
        }

        if (data.voucherError) {
          setVoucherErrorMsg(data.voucherError);
        } else {
          setVoucherErrorMsg(null);
        }
      }
    } catch (e) {
      console.error('Error calculating cart:', e);
    } finally {
      setLoading(false);
    }
  }, [cart, appliedVoucherCode, removeFromCart]);

  useEffect(() => {
    calculateCartTotals();
  }, [calculateCartTotals]);

  // 2. Handle Apply Voucher action
  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;

    if (!user) {
      setVoucherErrorMsg('Please register or log in to apply this voucher code.');
      return;
    }

    setApplyingVoucher(true);
    setVoucherErrorMsg(null);

    try {
      const res = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          voucherCode: voucherInput.trim().toUpperCase(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCalcResult(data);
        if (data.voucherError) {
          setVoucherErrorMsg(data.voucherError);
          setAppliedVoucherCode(null);
        } else {
          setAppliedVoucherCode(voucherInput.trim().toUpperCase());
          setVoucherErrorMsg(null);
        }
      }
    } catch (error) {
      setVoucherErrorMsg('Failed to apply voucher code. Please try again.');
    } finally {
      setApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucherCode(null);
    setVoucherInput('');
    setVoucherErrorMsg(null);
  };

  // 3. Render Empty Cart State
  if (!loading && (!calcResult || calcResult.items.length === 0)) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border border-red-100 mx-auto text-[#801414]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
            {language === 'ta' ? 'உங்கள் கார்ட் காலியாக உள்ளது' : 'Your Shopping Cart is Empty'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto font-medium">
            {language === 'ta'
              ? 'உங்கள் கூடையில் பொருட்கள் எதுவும் இல்லை. புதிய தயாரிப்புகளை வாங்க ஷாப்பிங் தொடங்குங்கள்.'
              : 'You have no items in your shopping cart. Discover our fresh groceries and quality products.'}
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#801414] hover:bg-[#630f0f] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all"
        >
          <span>{language === 'ta' ? 'ஷாப்பிங் தொடரவும்' : 'Continue Shopping'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // 4. Loading state
  if (loading || !calcResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#801414] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-gray-500 font-bold">Calculating cart totals...</p>
      </div>
    );
  }

  const isFreeDelivery = calcResult.deliveryFee === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-xs font-semibold">
      
      {/* Page Title */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-black text-gray-900">
            {t('cartTitle')}
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {calcResult.items.length} {calcResult.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Link
          href="/shop"
          className="text-xs text-[#801414] hover:underline font-bold flex items-center gap-1"
        >
          <span>← Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {calcResult.items.map((item) => {
            const hasDiscount = item.basePrice > item.finalPrice;
            return (
              <div
                key={item.productId}
                className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                {/* Product Image & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-20 h-20 bg-cover bg-center rounded-lg border border-gray-150 shrink-0 bg-gray-50"
                    style={{ backgroundImage: `url('${item.image || '/images/hero_banner.png'}')` }}
                  />
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-[#801414]">
                        ${item.finalPrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ${item.basePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {item.appliedOfferName && (
                      <span className="bg-green-50 text-[#1B5E20] text-[9px] font-bold px-1.5 py-0.5 rounded border border-green-200 uppercase tracking-wide inline-flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.appliedOfferName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity adjustments */}
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 h-9 w-28 select-none shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-full flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="flex-grow text-center text-xs font-black text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-full flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal & Delete button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <span className="text-sm font-black text-gray-900 sm:w-20 text-right">
                    ${item.total.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Totals Summary Panel */}
        <div className="space-y-5">
          
          {/* 1. Clear Delivery Notice */}
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            isFreeDelivery
              ? 'bg-[#F3F8F3] border-[#C8E6C9] text-[#1B5E20]'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <Truck className="w-5 h-5 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold">
                {isFreeDelivery ? 'Free Delivery Applied ($0.00)' : 'Standard Delivery ($12.50)'}
              </p>
              <p className="text-[10px] font-medium opacity-90">
                {isFreeDelivery
                  ? 'Orders over $75 receive Free Delivery across Canada.'
                  : 'Orders over $75 receive Free Delivery.'}
              </p>
            </div>
          </div>

          {/* 2. Totals box */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>{t('cartSubtotal')}</span>
                <span className="font-bold text-gray-900">${calcResult.subtotal.toFixed(2)}</span>
              </div>
              
              {calcResult.itemDiscounts > 0 && (
                <div className="flex justify-between text-[#1B5E20] font-bold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" />
                    Offers Discount
                  </span>
                  <span>-${calcResult.itemDiscounts.toFixed(2)}</span>
                </div>
              )}

              {calcResult.voucherDiscount > 0 && (
                <div className="flex justify-between text-[#1B5E20] font-bold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" />
                    Voucher Discount
                  </span>
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

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                <span className="text-sm font-black text-gray-900">{t('cartTotal')}</span>
                <span className="text-2xl font-serif font-black text-[#801414]">
                  ${calcResult.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Voucher apply box */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <h4 className="text-xs font-bold text-gray-900">{t('cartApplyVoucher')}</h4>
              
              {calcResult.appliedVoucher ? (
                <div className="bg-green-50 text-green-900 border border-green-200 rounded-lg p-2.5 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="text-xs font-black">
                      CODE: {calcResult.appliedVoucher.code}
                    </p>
                    <p className="text-[10px] text-green-700 font-medium">
                      Saved ${calcResult.appliedVoucher.discountAmount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="text-xs text-red-600 hover:text-red-700 font-bold hover:underline"
                  >
                    {t('cartRemoveVoucher')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Voucher code (e.g. WELCOME10)"
                    value={voucherInput}
                    onChange={(e) => {
                      setVoucherInput(e.target.value.toUpperCase());
                      setVoucherErrorMsg(null);
                    }}
                    className="flex-grow px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none focus:bg-white focus:border-[#801414] text-gray-900 font-bold uppercase tracking-wider"
                    disabled={applyingVoucher}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#801414] hover:bg-[#630f0f] text-white text-xs font-bold rounded-lg transition-colors disabled:bg-gray-400"
                    disabled={applyingVoucher || !voucherInput.trim()}
                  >
                    {applyingVoucher ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Voucher error feedback */}
              {voucherErrorMsg && (
                <p className="text-[10px] text-red-600 font-bold bg-red-50 p-2 rounded-md border border-red-100">
                  ⚠️ {voucherErrorMsg}
                </p>
              )}
            </div>

            {/* Proceed to checkout CTA */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full h-11 flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              <span>{t('cartCheckout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
