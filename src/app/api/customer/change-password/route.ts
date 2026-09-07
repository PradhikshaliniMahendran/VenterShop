import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import User from '@/models/User';
import { verifyPassword, hashPassword } from '@/lib/auth/password';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
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

    const userRecord = await User.findById(user.id);
    if (!userRecord) {
      return NextResponse.json({ error: 'Customer account not found.' }, { status: 404 });
    }

    const isCurrentCorrect = verifyPassword(currentPassword, userRecord.password);
    if (!isCurrentCorrect) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    userRecord.password = hashPassword(newPassword);
    await userRecord.save();

    return NextResponse.json({ message: 'Password updated successfully.' });
  } catch (error: any) {
    console.error('Error changing customer password:', error);
    return NextResponse.json({ error: error.message || 'Failed to update password.' }, { status: 500 });
  }
}
