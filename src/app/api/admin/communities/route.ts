import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Community from '@/models/Community';
import User from '@/models/User';

// GET: List all community groups + pending join requests
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includePending = searchParams.get('pending') === 'true';

    const communities = await Community.find().sort({ createdAt: -1 });

    let pendingRequests: any[] = [];
    if (includePending) {
      pendingRequests = await User.find({ communityStatus: 'PENDING' })
        .populate('communityId', 'name membershipCode')
        .select('firstName lastName email communityId communityJoinDate communityStatus')
        .sort({ communityJoinDate: -1 });
    }

    return NextResponse.json({ communities, pendingRequests });
  } catch (error: any) {
    console.error('Error fetching communities API:', error);
    return NextResponse.json({ error: 'Failed to fetch communities' }, { status: 500 });
  }
}

// POST: Create a new community group
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, membershipCode, isActive } = await request.json();

    if (!name || !description) {
      return NextResponse.json({ error: 'Community name and description are required' }, { status: 400 });
    }

    const cleanCode = (membershipCode || name.substring(0, 4) + '100').toUpperCase().trim();

    const newCommunity = await Community.create({
      name: name.trim(),
      description: description.trim(),
      membershipCode: cleanCode,
      isActive: isActive ?? true,
      memberCount: 0,
    });

    console.log(`[MONGODB] Created new Community group: ${newCommunity.name}`);

    return NextResponse.json({
      message: 'Community group created successfully',
      community: newCommunity,
    });
  } catch (error: any) {
    console.error('Error creating community API:', error);
    return NextResponse.json({ error: error.message || 'Failed to create community' }, { status: 500 });
  }
}

// PATCH: Approve or reject a user's community join request
export async function PATCH(request: Request) {
  try {
    await connectToDatabase();

    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, action } = await request.json();
    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action (approve/reject) are required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'approve') {
      user.communityStatus = 'APPROVED';
      user.customerType = 'COMMUNITY';
      await user.save();

      if (user.communityId) {
        await Community.findByIdAndUpdate(user.communityId, { $inc: { memberCount: 1 } });
      }

      console.log(`[MONGODB] Admin approved community request for: ${user.email}`);
      return NextResponse.json({ message: `Community membership approved for ${user.email}` });

    } else if (action === 'reject') {
      user.communityStatus = 'NONE';
      user.communityId = null;
      user.communityJoinDate = undefined;
      await user.save();

      console.log(`[MONGODB] Admin rejected community request for: ${user.email}`);
      return NextResponse.json({ message: `Community membership rejected for ${user.email}` });

    } else {
      return NextResponse.json({ error: 'Invalid action. Use "approve" or "reject".' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error updating community membership:', error);
    return NextResponse.json({ error: error.message || 'Failed to update membership' }, { status: 500 });
  }
}

// PUT: Update existing community group
export async function PUT(request: Request) {
  try {
    await connectToDatabase();

    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { communityId, name, description, membershipCode, isActive } = await request.json();

    if (!communityId) {
      return NextResponse.json({ error: 'Community ID is required' }, { status: 400 });
    }

    const community = await Community.findById(communityId);
    if (!community) {
      return NextResponse.json({ error: 'Community group not found' }, { status: 404 });
    }

    if (name) community.name = name.trim();
    if (description) community.description = description.trim();
    if (membershipCode) community.membershipCode = membershipCode.toUpperCase().trim();
    if (isActive !== undefined) community.isActive = isActive;

    await community.save();

    console.log(`[MONGODB] Updated Community group: ${community.name}`);

    return NextResponse.json({
      message: 'Community group updated successfully',
      community,
    });
  } catch (error: any) {
    console.error('Error updating community API:', error);
    return NextResponse.json({ error: error.message || 'Failed to update community' }, { status: 500 });
  }
}

// DELETE: Remove community group
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();

    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get('id');

    if (!communityId) {
      return NextResponse.json({ error: 'Community ID is required' }, { status: 400 });
    }

    const deleted = await Community.findByIdAndDelete(communityId);
    if (!deleted) {
      return NextResponse.json({ error: 'Community group not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Community group deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting community API:', error);
    return NextResponse.json({ error: 'Failed to delete community' }, { status: 500 });
  }
}
