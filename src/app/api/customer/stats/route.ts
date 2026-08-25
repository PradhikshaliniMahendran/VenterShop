import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Order from '@/models/Order';
import { Voucher } from '@/models/Voucher';

export async function GET() {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // 1. Fetch Order Statistics
    const [totalOrders, activeOrders, completedOrders] = await Promise.all([
      Order.countDocuments({ userId }),
      Order.countDocuments({
        userId,
        orderStatus: { $in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'] },
      }),
      Order.countDocuments({ userId, orderStatus: 'DELIVERED' }),
    ]);

    // 2. Fetch Recent Orders (limit to 3)
    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    // 3. Calculate Total Savings (sum of discount from all completed orders)
    const completedOrdersList = await Order.find({ userId, orderStatus: 'DELIVERED' });
    const totalSavings = completedOrdersList.reduce((sum, order) => sum + (order.discount || 0), 0);

    // 4. Fetch Available Vouchers count
    const activeVouchersCount = await Voucher.countDocuments({
      isActive: true,
      customerTypes: user.customerType as any,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    return NextResponse.json({
      stats: {
        totalOrders,
        activeOrders,
        completedOrders,
        totalSavings: Math.round(totalSavings * 100) / 100,
        availableVouchers: activeVouchersCount,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    return NextResponse.json({ error: 'Failed to fetch customer stats' }, { status: 500 });
  }
}
