import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import WholesaleApplication from '@/models/WholesaleApplication';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // 1. Authenticate admin user
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const selectedMonth = searchParams.get('month'); // e.g. '2026-09' or 'ALL'

    // Build order date filter query for revenue
    const matchFilter: any = { orderStatus: { $ne: 'CANCELLED' } };
    if (selectedMonth && selectedMonth !== 'ALL') {
      const [yearStr, monthStr] = selectedMonth.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      if (!isNaN(year) && !isNaN(month)) {
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        matchFilter.createdAt = { $gte: startDate, $lte: endDate };
      }
    }

    // 2. Compute Filtered Sales Revenue
    const activeOrdersSum = await Order.aggregate([
      { $match: matchFilter },
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, count: { $sum: 1 } } },
    ]);
    const totalRevenue = activeOrdersSum[0]?.totalRevenue || 0;
    const filteredOrderCount = activeOrdersSum[0]?.count || 0;

    // 2b. Compute Overall Total Revenue (all time for reference)
    const overallSum = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const overallRevenue = overallSum[0]?.totalRevenue || 0;

    // 2c. Compute Monthly Revenue Breakdown
    const monthlyBreakdownRaw = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalRevenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyBreakdown = monthlyBreakdownRaw.map((item) => {
      const year = item._id.year;
      const monthNum = item._id.month; // 1-12
      const monthKey = `${year}-${String(monthNum).padStart(2, '0')}`;
      const monthLabel = `${monthNames[monthNum - 1]} ${year}`;
      return {
        key: monthKey,
        label: monthLabel,
        year,
        month: monthNum,
        totalRevenue: Math.round(item.totalRevenue * 100) / 100,
        orderCount: item.orderCount,
      };
    });

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
        overallRevenue: Math.round(overallRevenue * 100) / 100,
        filteredOrderCount,
        activeOrders: activeOrdersCount,
        totalCustomers: totalCustomersCount,
        pendingWholesale: pendingWholesaleCount,
        selectedMonth: selectedMonth || 'ALL',
      },
      monthlyBreakdown,
      lowStockAlerts,
      recentOrders,
      recentB2BApplications,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
