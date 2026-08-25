import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import { PricingService } from '@/lib/services/pricingService';
import { VoucherService } from '@/lib/services/voucherService';
import Setting from '@/models/Setting';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // Get currently authenticated user details
    const user = await getCurrentUser();
    const customerType = user && user.customerType !== 'ADMIN' ? user.customerType : 'NORMAL';
    const communityId = user ? user.communityId : null;
    const userId = user ? user.id : null;

    const { items, voucherCode } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items payload' }, { status: 400 });
    }

    if (items.length === 0) {
      return NextResponse.json({
        items: [],
        subtotal: 0,
        itemDiscounts: 0,
        voucherDiscount: 0,
        deliveryFee: 0,
        freeDeliveryThreshold: 75,
        total: 0,
        appliedVoucher: null,
        voucherError: null,
      });
    }

    // 1. Calculate pricing breakdown using PricingService
    const breakdown = await PricingService.calculateCart(items, customerType, communityId);

    let voucherDiscount = 0;
    let voucherError: string | null = null;
    let appliedVoucher = null;

    // 2. Validate voucher if present
    if (voucherCode) {
      if (!userId) {
        voucherError = 'Please register or log in to apply this voucher code.';
      } else {
        try {
          const voucherRes = await VoucherService.validateVoucher(
            voucherCode,
            userId,
            items,
            customerType,
            communityId
          );
          voucherDiscount = voucherRes.discountAmount;
          appliedVoucher = {
            code: voucherRes.code,
            discountAmount: voucherRes.discountAmount,
          };
        } catch (err: any) {
          voucherError = err.message || 'Voucher is invalid for this order';
        }
      }
    }

    // 3. Compute final totals
    const finalDiscount = breakdown.itemDiscounts + voucherDiscount;
    const cartTotalAfterDiscount = breakdown.subtotal - finalDiscount;
    
    // Recalculate shipping based on new subtotal after voucher
    const settings = await Setting.findOne();
    const freeDeliveryThreshold = settings?.freeDeliveryThreshold ?? 75;
    const defaultDeliveryFee = 12.5;

    const deliveryFee = cartTotalAfterDiscount >= freeDeliveryThreshold ? 0 : defaultDeliveryFee;
    const finalTotal = Math.max(0, cartTotalAfterDiscount + deliveryFee);

    return NextResponse.json({
      items: breakdown.items,
      subtotal: Math.round(breakdown.subtotal * 100) / 100,
      itemDiscounts: Math.round(breakdown.itemDiscounts * 100) / 100,
      voucherDiscount: Math.round(voucherDiscount * 100) / 100,
      deliveryFee: Math.round(deliveryFee * 100) / 100,
      freeDeliveryThreshold,
      total: Math.round(finalTotal * 100) / 100,
      appliedVoucher,
      voucherError,
    });
  } catch (error: any) {
    console.error('Error in /api/cart/calculate:', error);
    return NextResponse.json({ error: 'Failed to calculate cart totals' }, { status: 500 });
  }
}
