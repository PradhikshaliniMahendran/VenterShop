import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Order from '@/models/Order';
import User from '@/models/User';
import { EmailService } from '@/lib/services/emailService';

// 1. GET: Fetch all store orders (with filters)
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q');

    const queryFilter: any = {};
    if (status && status !== 'ALL') {
      queryFilter.orderStatus = status;
    }
    if (q) {
      queryFilter.orderNumber = new RegExp(q.trim(), 'i');
    }

    const orders = await Order.find(queryFilter)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 550 });
  }
}

// 2. PUT: Update order details (statuses)
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, orderStatus, paymentStatus } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await Order.findById(orderId).populate('userId', 'firstName lastName email');
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const prevOrderStatus = order.orderStatus;
    const prevPaymentStatus = order.paymentStatus;

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    // Trigger transactional emails on fulfillment milestones
    try {
      const customerUser = order.userId as any;
      if (customerUser && customerUser.email) {
        const customerName = `${customerUser.firstName} ${customerUser.lastName}`;
        
        if (orderStatus && orderStatus !== prevOrderStatus) {
          if (orderStatus === 'CONFIRMED') {
            await EmailService.sendOrderConfirmation(customerUser.email, customerName, order);
          } else {
            await EmailService.sendOrderStatusUpdate(customerUser.email, customerName, order.orderNumber, orderStatus);
          }
        }
      }
    } catch (emailErr) {
      console.warn('[ADMIN ORDER EMAIL ERROR] Failed to dispatch transactional update email:', emailErr);
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 550 });
  }
}
