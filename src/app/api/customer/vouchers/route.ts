import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import { Voucher, VoucherUsage } from '@/models/Voucher';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Community from '@/models/Community';

export async function GET() {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const userId = user.id;

    // Fetch all vouchers that target this user's customerType
    const vouchers = await Voucher.find({
      customerTypes: user.customerType as any,
    })
      .populate('categoryIds', 'name slug')
      .populate('productIds', 'name slug')
      .populate('communityIds', 'name');

    const available: any[] = [];
    const used: any[] = [];
    const expired: any[] = [];

    for (const v of vouchers) {
      // Check community constraint
      if (v.communityIds && v.communityIds.length > 0) {
        const isMember = user.communityId && v.communityIds.some((c: any) => c._id.toString() === user.communityId);
        if (!isMember) continue; // Skip since user does not belong to this targeted community
      }

      // Check user usage count
      const usageCount = await VoucherUsage.countDocuments({
        voucherId: v._id,
        userId,
      });

      const isUsedUp = usageCount >= v.perCustomerLimit;
      const isExpiredDate = now > v.endDate || now < v.startDate;
      const isGlobalLimitReached = v.usageLimit !== undefined && v.usedCount >= v.usageLimit;

      const voucherJson = v.toJSON();

      if (isUsedUp) {
        used.push({ ...voucherJson, usageCount });
      } else if (isExpiredDate || !v.isActive || isGlobalLimitReached) {
        expired.push({ ...voucherJson, usageCount });
      } else {
        available.push({ ...voucherJson, usageCount });
      }
    }

    return NextResponse.json({
      available,
      used,
      expired,
    });
  } catch (error) {
    console.error('Error fetching customer vouchers wallet:', error);
    return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
  }
}
