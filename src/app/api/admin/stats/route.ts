import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import WholesaleApplication from '@/models/WholesaleApplication';

export async function GET() {
  try {
    await connectToDatabase();
    
    // 1. Authenticate admin user
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Compute Total Revenue (sum of total field from all active orders)
    const activeOrdersSum = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const totalRevenue = activeOrdersSum[0]?.totalRevenue || 0;

    // 3. Count Open / Active Orders
    const activeOrdersCount = await Order.countDocuments({
      orderStatus: { $in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'] },
    });

    // 4. Count Registered Customers
    const totalCustomersCount = await User.countDocuments({ status: 'ACTIVE' });

    // 5. Count Pending B2B applications
    const pendingWholesaleCount = await WholesaleApplication.countDocuments({ status: 'PENDING' });

    // 6. Fetch Low Stock Alerts
    const lowStockAlerts = await Product.find({
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    }).limit(10);

    // 7. Fetch Recent Orders (limit to 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // 8. Fetch Recent B2B Wholesale Applications (limit to 5)
    const recentB2BApplications = await WholesaleApplication.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      metrics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        activeOrders: activeOrdersCount,
        totalCustomers: totalCustomersCount,
        pendingWholesale: pendingWholesaleCount,
      },
      lowStockAlerts,
      recentOrders,
      recentB2BApplications,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
