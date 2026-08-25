import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import User from '@/models/User';
import Community from '@/models/Community';
import WholesaleApplication from '@/models/WholesaleApplication';
import { EmailService } from '@/lib/services/emailService';

// 1. GET: Fetch all customers, B2B applications, and communities
export async function GET() {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [customers, applications, communities] = await Promise.all([
      User.find().populate('communityId', 'name').sort({ createdAt: -1 }),
      WholesaleApplication.find().sort({ createdAt: -1 }),
      Community.find().sort({ name: 1 }),
    ]);

    return NextResponse.json({
      customers,
      applications,
      communities,
    });
  } catch (error) {
    console.error('Error fetching customers directory:', error);
    return NextResponse.json({ error: 'Failed to fetch directory data' }, { status: 500 });
  }
}

// 2. PUT: Update customer settings (suspension, community assignment, B2B applications approval)
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, userId, status, communityId, applicationId, appStatus } = body;

    // A. Update direct Customer metadata (suspension or community)
    if (action === 'update_customer') {
      if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }

      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }

      if (status) user.status = status;
      if (communityId !== undefined) {
        user.communityId = communityId ? communityId : null;
        user.customerType = communityId ? 'COMMUNITY' : 'NORMAL';
      }

      await user.save();
      return NextResponse.json({ message: 'Customer profile updated successfully', user });
    }

    // B. Approve or Reject wholesale application
    if (action === 'review_wholesale') {
      if (!applicationId || !appStatus) {
        return NextResponse.json({ error: 'Application ID and decision status are required' }, { status: 400 });
      }

      const app = await WholesaleApplication.findById(applicationId);
      if (!app) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      app.status = appStatus;
      await app.save();

      // If approved, update target user's customerType to WHOLESALE
      const targetUser = await User.findById(app.userId);
      if (targetUser) {
        if (appStatus === 'APPROVED') {
          targetUser.customerType = 'WHOLESALE';
          await targetUser.save();
        } else if (appStatus === 'REJECTED' && targetUser.customerType === 'WHOLESALE') {
          targetUser.customerType = 'NORMAL';
          await targetUser.save();
        }

        // Trigger transactional emails
        try {
          const customerName = `${targetUser.firstName} ${targetUser.lastName}`;
          if (appStatus === 'APPROVED') {
            await EmailService.sendWholesaleApproval(targetUser.email, customerName, app.businessName);
          }
        } catch (emailErr) {
          console.warn('[ADMIN B2B EMAIL ERROR] Failed to dispatch B2B notification email:', emailErr);
        }
      }

      return NextResponse.json({ message: 'Wholesale application reviewed successfully', application: app });
    }

    return NextResponse.json({ error: 'Invalid action payload' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in administrative customer action:', error);
    return NextResponse.json({ error: error.message || 'Action failed' }, { status: 500 });
  }
}
