import { NextResponse } from 'next/server';
import { getCurrentCustomer } from '@/lib/auth/auth';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Community from '@/models/Community';

export async function GET() {
  try {
    const user = await getCurrentCustomer();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!user.communityId) {
      return NextResponse.json({ community: null });
    }

    await connectToDatabase();

    const community = await Community.findById(user.communityId).select('name description memberCount membershipCode isActive');
    if (!community) {
      return NextResponse.json({ community: null });
    }

    return NextResponse.json({ community });
  } catch (error) {
    console.error('Error fetching community info:', error);
    return NextResponse.json({ error: 'Failed to fetch community info' }, { status: 500 });
  }
}
