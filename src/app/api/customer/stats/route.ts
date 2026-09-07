import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Order from '@/models/Order';
import { Voucher } from '@/models/Voucher';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    let totalOrders = 0;
    let activeOrders = 0;
    let completedOrders = 0;
    let totalSavings = 0;
    let availableVouchers = 0;
    let recentOrders: any[] = [];

    try {
      await connectToDatabase();

      // 1. Fetch Order Statistics
      const [tOrders, aOrders, cOrders] = await Promise.all([
        Order.countDocuments({ userId }),
        Order.countDocuments({
          userId,
          orderStatus: { $in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'] },
        }),
        Order.countDocuments({ userId, orderStatus: 'DELIVERED' }),
      ]);
      totalOrders = tOrders || 0;
      activeOrders = aOrders || 0;
      completedOrders = cOrders || 0;

      // 2. Fetch Recent Orders (limit to 5)
      recentOrders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5);

      // 3. Calculate Total Savings
      const completedOrdersList = await Order.find({ userId, orderStatus: 'DELIVERED' });
      totalSavings = completedOrdersList.reduce((sum, order) => sum + (order.discount || 0), 0);

      // 4. Fetch Available Vouchers count
      availableVouchers = await Voucher.countDocuments({
        isActive: true,
        customerTypes: (user.customerType || 'NORMAL') as any,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });
    } catch (dbErr) {
      console.warn('Database query skipped in stats, returning default stats payload:', dbErr);
    }

    return NextResponse.json({
      stats: {
        totalOrders,
        activeOrders,
        completedOrders,
        totalSavings: Math.round(totalSavings * 100) / 100,
        availableVouchers,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    return NextResponse.json({
      stats: {
        totalOrders: 0,
        activeOrders: 0,
        completedOrders: 0,
        totalSavings: 0,
        availableVouchers: 0,
      },
      recentOrders: [],
    });
  }
}
