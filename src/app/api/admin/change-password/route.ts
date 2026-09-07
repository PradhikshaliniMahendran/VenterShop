import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Admin from '@/models/Admin';
import { verifyPassword, hashPassword } from '@/lib/auth/password';

export async function POST(request: Request) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New password and confirmation do not match.' }, { status: 400 });
    }

    await connectToDatabase();

    const adminRecord = await Admin.findById(adminUser.id);
    if (!adminRecord) {
      // Default fallback check
      if (adminUser.email === 'admin@ventershop.ca' && currentPassword === 'admin123') {
        const hashedPassword = hashPassword(newPassword);
        await Admin.create({
          email: 'admin@ventershop.ca',
          password: hashedPassword,
          firstName: 'System',
          lastName: 'Admin',
          role: 'SUPER_ADMIN',
          isActive: true,
        });
        return NextResponse.json({ message: 'Admin password updated successfully.' });
      }
      return NextResponse.json({ error: 'Admin account not found in database.' }, { status: 404 });
    }

    const isCurrentCorrect = verifyPassword(currentPassword, adminRecord.password);
    if (!isCurrentCorrect) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    adminRecord.password = hashPassword(newPassword);
    await adminRecord.save();

    return NextResponse.json({ message: 'Admin password updated successfully.' });
  } catch (error: any) {
    console.error('Error changing admin password:', error);
    return NextResponse.json({ error: error.message || 'Failed to update password.' }, { status: 500 });
  }
}
