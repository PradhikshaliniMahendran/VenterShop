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
  }, [cart, appliedVoucherCode]);

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

  // 3. Render Empty state
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border border-gray-150 mx-auto shadow-xs text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#101A2D]">{t('cartTitle')}</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            {t('cartEmpty')}
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-block py-2.5 px-8 bg-[#1A2A4A] hover:bg-[#101A2D] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all"
        >
          {t('checkoutContinueShopping')}
        </Link>
      </div>
    );
  }

  // 4. Render Loading states
  if (loading || !calcResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-44 bg-gray-200 animate-pulse rounded-md" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-32 border border-gray-100 p-4 animate-pulse" />
          ))}
        </div>
        <div className="bg-white rounded-xl h-96 border border-gray-100 p-6 animate-pulse" />
      </div>
    );
  }

  // 5. Dynamic Free Delivery progress calculations
  const cartSubtotalAfterDiscounts = calcResult.subtotal - calcResult.itemDiscounts - calcResult.voucherDiscount;
  const deliveryProgressPercent = Math.min(100, (cartSubtotalAfterDiscounts / calcResult.freeDeliveryThreshold) * 100);
  const remainingForFreeDelivery = calcResult.freeDeliveryThreshold - cartSubtotalAfterDiscounts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-black text-[#1A2A4A] tracking-tight mb-8">
        {t('cartTitle')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {calcResult.items.map((item) => {
            // Find minimum quantity configuration if wholesale
            const isWholesale = user?.customerType === 'WHOLESALE';
            // We can block lowering quantity past wholesale limit if active B2B
            const minQty = isWholesale ? 2 : 1; // seeded min quantities default to 2 or 4, keep it simple

            return (
              <div
                key={item.productId}
                className="bg-white p-4 sm:p-5 rounded-xl border border-gray-150 shadow-xs flex flex-row items-center gap-4 relative group"
              >
                {/* Product Thumbnail */}
                <div
                  className="w-20 h-20 bg-cover bg-center bg-gray-50 rounded-lg border border-gray-150 shrink-0"
                  style={{ backgroundImage: `url('${item.image || '/images/hero_banner.png'}')` }}
                />

                {/* Product Details info */}
                <div className="flex-grow min-w-0 pr-4">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                    SKU: {item.sku}
                  </span>
                  <Link
                    href={`/product/${item.productId}`}
                    className="font-bold text-[#101A2D] hover:text-[#E53935] text-sm sm:text-base leading-snug line-clamp-1 truncate transition-colors"
                  >
                    {item.name}
                  </Link>

                  {/* Pricing row */}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-[#1A2A4A]">
                      ${item.finalPrice.toFixed(2)}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ${item.basePrice.toFixed(2)}
                      </span>
                    )}
                    {item.appliedOfferName && (
                      <span className="bg-red-50 text-[#E53935] text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm border border-red-100 uppercase tracking-wide inline-flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.appliedOfferName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity adjustments */}
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 h-9 w-28 shadow-xs select-none shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="flex-grow text-center text-xs font-extrabold text-[#101A2D]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Side: Totals Summary Panel */}
        <div className="space-y-6">
          
          {/* 1. Dynamic Delivery Progress strip */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-[#101A2D]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#1A2A4A]" />
                Shipping Status
              </span>
              <span>
                {remainingForFreeDelivery <= 0 ? 'Unlocked' : `$${remainingForFreeDelivery.toFixed(2)} left`}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  remainingForFreeDelivery <= 0 ? 'bg-emerald-600' : 'bg-[#1A2A4A]'
                }`}
                style={{ width: `${deliveryProgressPercent}%` }}
              />
            </div>
            
            <p className="text-[11px] text-gray-500 leading-normal font-semibold">
              {remainingForFreeDelivery <= 0 ? (
                <span className="text-emerald-700 font-extrabold">🎉 {t('cartFreeDeliveryUnlocked')}</span>
              ) : (
                <span>
                  Add <strong className="text-[#101A2D]">${remainingForFreeDelivery.toFixed(2)}</strong> {t('cartFreeDeliveryProgress')}
                </span>
              )}
            </p>
          </div>

          {/* 2. Totals box */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-6">
            <h3 className="font-extrabold text-sm text-[#101A2D] uppercase tracking-wider border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>{t('cartSubtotal')}</span>
                <span className="font-bold text-[#333333]">${calcResult.subtotal.toFixed(2)}</span>
              </div>
              
              {calcResult.itemDiscounts > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" />
                    Offers Discount
                  </span>
                  <span className="font-bold">-${calcResult.itemDiscounts.toFixed(2)}</span>
                </div>
              )}

              {calcResult.voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-extrabold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" />
                    Voucher Applied
                  </span>
                  <span>-${calcResult.voucherDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>{t('cartDelivery')}</span>
                <span className="font-bold text-[#333333]">
                  {calcResult.deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-extrabold">FREE</span>
                  ) : (
                    `$${calcResult.deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                <span className="text-sm font-extrabold text-[#101A2D]">{t('cartTotal')}</span>
                <span className="text-2xl font-black text-[#1A2A4A]">${calcResult.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Voucher apply box */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <h4 className="text-xs font-extrabold text-[#101A2D]">{t('cartApplyVoucher')}</h4>
              
              {calcResult.appliedVoucher ? (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-3 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="text-xs font-black tracking-wide">
                      CODE: {calcResult.appliedVoucher.code}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold">
                      Saved ${calcResult.appliedVoucher.discountAmount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="text-xs text-red-600 hover:text-red-700 font-extrabold hover:underline"
                  >
                    {t('cartRemoveVoucher')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('cartVoucherCode')}
                    value={voucherInput}
                    onChange={(e) => {
                      setVoucherInput(e.target.value.toUpperCase());
                      setVoucherErrorMsg(null);
                    }}
                    className="flex-grow px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none focus:bg-white focus:border-[#1A2A4A] text-gray-900 font-bold uppercase tracking-wider placeholder-gray-400"
                    disabled={applyingVoucher}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#1A2A4A] hover:bg-[#101A2D] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors disabled:bg-gray-400"
                    disabled={applyingVoucher || !voucherInput.trim()}
                  >
                    {applyingVoucher ? t('cartVoucherApplying') : 'Apply'}
                  </button>
                </form>
              )}

              {/* Voucher error feedback */}
              {voucherErrorMsg && (
                <p className="text-[10px] text-red-600 font-extrabold leading-normal bg-red-50 p-2 rounded-md border border-red-100">
                  ⚠️ {voucherErrorMsg}
                </p>
              )}
            </div>

            {/* Proceed to checkout CTA */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full h-11 flex items-center justify-center gap-2 bg-[#E53935] hover:bg-[#c62828] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg active:scale-98 transition-all"
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
