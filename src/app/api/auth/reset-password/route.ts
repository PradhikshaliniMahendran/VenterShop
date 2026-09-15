import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import OTP from '@/models/OTP';
import User from '@/models/User';
import Admin from '@/models/Admin';
import { SignJWT } from 'jose';
import { hashPassword } from '@/lib/auth/password';
import { verifyInMemoryOtp } from '@/lib/auth/inMemoryOtp';
import { saveInMemoryUser, getInMemoryUser } from '@/lib/auth/inMemoryUsers';

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword, confirmPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, verification code, and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match. Please re-enter.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const submittedOtp = otp.trim();

    // 1. Verify OTP
    let isValidOtp = false;

    // Check in-memory cache
    if (verifyInMemoryOtp(normalizedEmail, submittedOtp)) {
      isValidOtp = true;
    }

    // Check MongoDB OTP collection
    if (!isValidOtp) {
      try {
        await connectToDatabase();
        const otpRecord = await OTP.findOne({
          email: normalizedEmail,
          otp: submittedOtp,
          expiresAt: { $gt: new Date() },
        });

        if (otpRecord) {
          isValidOtp = true;
          await OTP.deleteMany({ email: normalizedEmail });
        }
      } catch (dbErr) {
        console.warn('Database error during OTP validation:', dbErr);
      }
    }

    if (!isValidOtp) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please request a new code.' },
        { status: 400 }
      );
    }

    // 2. Hash new password and update user/admin in DB and memory
    const hashedPassword = hashPassword(newPassword);
    let userId = 'usr_' + Date.now();
    let userRole = 'CUSTOMER';
    let customerType = 'BUYER';
    let userFirstName = 'Valued';
    let userLastName = 'Customer';
    let userFound = false;

    try {
      await connectToDatabase();

      // Check Admin
      const adminRecord = await Admin.findOne({ email: normalizedEmail });
      if (adminRecord) {
        adminRecord.password = hashedPassword;
        await adminRecord.save();
        userId = adminRecord._id.toString();
        userRole = adminRecord.role || 'ADMIN';
        customerType = 'ADMIN';
        userFirstName = adminRecord.firstName || 'Admin';
        userLastName = adminRecord.lastName || 'User';
        userFound = true;
      } else {
        // Check User
        const userRecord = await User.findOne({ email: normalizedEmail });
        if (userRecord) {
          userRecord.password = hashedPassword;
          await userRecord.save();
          userId = userRecord._id.toString();
          customerType = userRecord.customerType || 'BUYER';
          userFirstName = userRecord.firstName || 'Valued';
          userLastName = userRecord.lastName || 'Customer';
          userFound = true;
        }
      }
    } catch (dbErr) {
      console.warn('Database update skipped for password reset:', dbErr);
    }

    // Update in-memory user
    const memUser = getInMemoryUser(normalizedEmail);
    if (memUser) {
      memUser.passwordHash = hashedPassword;
      saveInMemoryUser(memUser);
      userId = memUser.id;
      userRole = memUser.role;
      customerType = memUser.customerType;
      userFirstName = memUser.firstName;
      userLastName = memUser.lastName;
      userFound = true;
    } else if (!userFound) {
      // Create user if not found
      saveInMemoryUser({
        id: userId,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        firstName: userFirstName,
        lastName: userLastName,
        phone: '',
        customerType: 'BUYER',
        role: 'CUSTOMER',
        status: 'ACTIVE',
      });
    }

    // 3. Issue new session token
    const jwtSecretValue = process.env.JWT_SECRET || 'ventershop_development_secret_key_change_me_in_production';
    const secret = new TextEncoder().encode(jwtSecretValue);

    const token = await new SignJWT({
      userId,
      email: normalizedEmail,
      role: userRole,
      customerType,
      firstName: userFirstName,
      lastName: userLastName,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({
      message: 'Password reset successfully! You are now logged in.',
      user: {
        id: userId,
        email: normalizedEmail,
        role: userRole,
        customerType,
        firstName: userFirstName,
        lastName: userLastName,
      },
    });
  } catch (error: any) {
    console.error('Error in reset-password API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}
