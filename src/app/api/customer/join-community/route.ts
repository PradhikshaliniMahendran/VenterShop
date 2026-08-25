import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getCurrentCustomer } from '@/lib/auth/auth';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import User from '@/models/User';
import Community from '@/models/Community';

export async function POST(request: Request) {
  try {
    const authUser = await getCurrentCustomer();
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required. Please log in first.' }, { status: 401 });
    }

    const { communityId } = await request.json();
    if (!communityId) {
      return NextResponse.json({ error: 'Community ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(communityId)
      ? { _id: communityId }
      : { membershipCode: communityId.toUpperCase() };

    const community = await Community.findOne(query);
    if (!community || !community.isActive) {
      return NextResponse.json({ error: 'Selected community group is not available' }, { status: 404 });
    }

    const user = await User.findById(authUser.id);
    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    // Check if already a member or pending
    if (user.communityStatus === 'APPROVED') {
      return NextResponse.json({ error: 'You are already an approved member of a community group.' }, { status: 409 });
    }
    if (user.communityStatus === 'PENDING') {
      return NextResponse.json({ error: 'Your community membership request is already pending admin approval.' }, { status: 409 });
    }

    // Set to PENDING — Admin must approve before benefits are unlocked
    user.communityId = community._id;
    user.communityStatus = 'PENDING';
    user.communityJoinDate = new Date();
    // customerType stays NORMAL until admin approves
    await user.save();

    console.log(`[MONGODB] User ${user.email} submitted community join request for: ${community.name} (PENDING)`);

    return NextResponse.json({
      message: `Your request to join "${community.name}" has been submitted! Awaiting admin approval.`,
      status: 'PENDING',
    });
  } catch (error: any) {
    console.error('Error joining community API:', error);
    return NextResponse.json({ error: 'Failed to join community. Please try again.' }, { status: 500 });
  }
}
