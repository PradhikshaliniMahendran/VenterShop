import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import User from '@/models/User';

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstName, lastName, phone, preferredLanguage } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim(),
        preferredLanguage: preferredLanguage || 'en',
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        customerType: updatedUser.customerType,
        preferredLanguage: updatedUser.preferredLanguage,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 550 });
  }
}
