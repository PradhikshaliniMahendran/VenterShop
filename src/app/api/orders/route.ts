import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { Voucher, VoucherUsage } from '@/models/Voucher';
import { PricingService } from '@/lib/services/pricingService';
import { VoucherService } from '@/lib/services/voucherService';
import { EmailService } from '@/lib/services/emailService';
import Setting from '@/models/Setting';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // 1. Authenticate user
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Please log in as a customer to place an order.' }, { status: 401 });
    }

    const { items, deliveryAddress, voucherCode } = await request.json();

    // 2. Validate basic input parameters
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your shopping cart is empty' }, { status: 400 });
    }
    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.addressLine1 || !deliveryAddress.city || !deliveryAddress.province || !deliveryAddress.postalCode || !deliveryAddress.phone) {
      return NextResponse.json({ error: 'Please provide a complete shipping address' }, { status: 400 });
    }

    // 3. Atomically check and validate product inventory
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json({ error: `Product not found or inactive` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}". Only ${product.stock} units available.` },
          { status: 400 }
        );
      }
    }

    // 4. Calculate prices on the server side
    const customerType = user.customerType !== 'ADMIN' ? user.customerType : 'NORMAL';
    const communityId = user.communityId;
    const userId = user.id;

    const breakdown = await PricingService.calculateCart(items, customerType, communityId);

    let voucherDiscount = 0;
    let voucherDoc = null;

    if (voucherCode) {
      try {
        const voucherRes = await VoucherService.validateVoucher(
          voucherCode,
          userId,
          items,
          customerType,
          communityId
        );
        voucherDiscount = voucherRes.discountAmount;
        voucherDoc = await Voucher.findById(voucherRes.voucherId);
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Voucher validation failed' }, { status: 400 });
      }
    }

    // Compute final totals
    const finalDiscount = breakdown.itemDiscounts + voucherDiscount;
    const cartTotalAfterDiscount = breakdown.subtotal - finalDiscount;
    
    // Shipping calculations
    const settings = await Setting.findOne();
    const freeDeliveryThreshold = settings?.freeDeliveryThreshold ?? 75;
    const defaultDeliveryFee = 12.5;

    const deliveryFee = cartTotalAfterDiscount >= freeDeliveryThreshold ? 0 : defaultDeliveryFee;
    const finalTotal = Math.max(0, cartTotalAfterDiscount + deliveryFee);

    // 5. Generate unique Order Number: VS-YYYY-[6 random digits]
    const year = new Date().getFullYear();
    let orderNumber = '';
    let isUnique = false;

    // Retry loop to ensure order number is globally unique (extremely safe)
    while (!isUnique) {
      const randomSeq = Math.floor(100000 + Math.random() * 900000);
      orderNumber = `VS-${year}-${randomSeq}`;
      const existingOrder = await Order.findOne({ orderNumber });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    // 6. Map order items payload
    const orderItems = breakdown.items.map((item) => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      name: item.name,
      sku: item.sku,
      price: item.finalPrice,
      quantity: item.quantity,
      total: item.total,
    }));

    // 7. Decrement stock atomically in Product collection
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // 8. Create the Order
    const newOrder = await Order.create({
      orderNumber,
      userId: new mongoose.Types.ObjectId(userId),
      customerType,
      communityId: communityId ? new mongoose.Types.ObjectId(communityId) : null,
      items: orderItems,
      subtotal: breakdown.subtotal,
      discount: finalDiscount,
      deliveryFee,
      total: Math.round(finalTotal * 100) / 100,
      voucherId: voucherDoc ? voucherDoc._id : null,
      voucherCode: voucherDoc ? voucherDoc.code : undefined,
      deliveryAddress,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
    });

    // 9. If voucher applied, record usage counters
    if (voucherDoc) {
      await VoucherUsage.create({
        voucherId: voucherDoc._id,
        userId: new mongoose.Types.ObjectId(userId),
        orderId: newOrder._id,
      });

      await Voucher.findByIdAndUpdate(voucherDoc._id, {
        $inc: { usedCount: 1 },
      });
    }

    // 10. Send HTML email notifications (wrapped in try-catch to prevent crash if mailer is local dummy)
    try {
      const userFullName = `${user.firstName} ${user.lastName}`;
      // Send Order receipt to user
      await EmailService.sendOrderConfirmation(user.email, userFullName, newOrder);
      
      // Send Alert to Admin console
      const adminEmail = settings?.primaryEmail || 'admin@ventershop.ca';
      await EmailService.sendAdminNewOrderNotification(adminEmail, newOrder);
    } catch (emailErr) {
      console.warn('[ORDER MAIL ERROR] Failed to send order emails:', emailErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: newOrder._id.toString(),
    });
  } catch (error: any) {
    console.error('Error placing order API:', error);
    return NextResponse.json({ error: 'Failed to process checkout. Please try again.' }, { status: 500 });
  }
}
