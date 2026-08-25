import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import AuditLog from '@/models/AuditLog';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await AuditLog.find()
      .populate('adminId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(100); // Caps to 100 recent actions for readability

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching admin audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
