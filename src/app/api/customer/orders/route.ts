import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Order from '@/models/Order';

export async function GET() {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await Order.find({ userId: user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
