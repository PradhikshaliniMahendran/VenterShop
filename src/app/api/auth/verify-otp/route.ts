import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import OTP from '@/models/OTP';
import User from '@/models/User';
import Admin from '@/models/Admin';
import { SignJWT } from 'jose';
import { verifyPassword, hashPassword } from '@/lib/auth/password';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, otp, password, firstName, lastName, phone, preferredLanguage } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const submittedOtp = otp.trim();

    // 1. PASSWORD-BASED LOGIN FLOW (No OTP code required)
    if (submittedOtp === 'PASSWORD_LOGIN') {
      if (!password) {
        return NextResponse.json({ error: 'Password is required to log in.' }, { status: 400 });
      }

      const adminRecord = await Admin.findOne({ email: normalizedEmail, isActive: true });
      let userRole = 'CUSTOMER';
      let customerType = 'NORMAL';
      let userId = '';
      let userFirstName = '';
      let userLastName = '';
      let dbHashedPassword = '';

      if (adminRecord) {
        userRole = adminRecord.role;
        customerType = 'ADMIN';
        userId = adminRecord._id.toString();
        userFirstName = adminRecord.firstName;
        userLastName = adminRecord.lastName;
        dbHashedPassword = adminRecord.password;
      } else {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
          return NextResponse.json({ error: 'This email is not registered. Please register first.' }, { status: 404 });
        }
        if (user.status === 'SUSPENDED') {
          return NextResponse.json({ error: 'Your account has been suspended.' }, { status: 403 });
        }
        userId = user._id.toString();
        customerType = user.customerType;
        userFirstName = user.firstName;
        userLastName = user.lastName;
        dbHashedPassword = user.password;
      }

      // Verify the password
      const isPasswordCorrect = verifyPassword(password, dbHashedPassword);
      if (!isPasswordCorrect) {
        return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
      }

      // Generate JWT token using jose (edge-compatible)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
      }

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
      // Admin users get a separate cookie to avoid conflicting with customer sessions
      const cookieName = (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') ? 'admin_session' : 'session';
      cookieStore.set(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return NextResponse.json({
        message: 'Logged in successfully',
        user: {
          id: userId,
          email: normalizedEmail,
          role: userRole,
          customerType,
          firstName: userFirstName,
          lastName: userLastName,
        },
      });
    }

    // 2. REGISTRATION FLOW (OTP code verification + Password hashing)
    const otpRecord = await OTP.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 });
    }

    if (otpRecord.verified) {
      return NextResponse.json({ error: 'This verification code has already been used' }, { status: 400 });
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    if (otpRecord.attempts >= 3) {
      return NextResponse.json({ error: 'Too many incorrect attempts. Please request a new code.' }, { status: 400 });
    }

    // Verify OTP code
    if (otpRecord.otp !== submittedOtp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remainingAttempts = 3 - otpRecord.attempts;
      const attemptText = remainingAttempts === 1 ? 'attempt' : 'attempts';
      return NextResponse.json(
        {
          error:
            remainingAttempts <= 0
              ? 'Too many incorrect attempts. Please request a new code.'
              : `Incorrect code. ${remainingAttempts} ${attemptText} remaining.`,
        },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Check if the user is an admin
    const adminRecord = await Admin.findOne({ email: normalizedEmail, isActive: true });
    let isSystemAdmin = false;
    let userRole = 'CUSTOMER';
    let customerType = 'NORMAL';
    let userId = '';
    let userFirstName = '';
    let userLastName = '';

    if (adminRecord) {
      isSystemAdmin = true;
      userRole = adminRecord.role;
      customerType = 'ADMIN';
      userId = adminRecord._id.toString();
      userFirstName = adminRecord.firstName;
      userLastName = adminRecord.lastName;
    } else {
      // Find or create customer
      let user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        const rawPassword = password || 'VenterShop2026!';
        const hashedPassword = hashPassword(rawPassword);
        user = await User.create({
          email: normalizedEmail,
          password: hashedPassword, // Store hashed password
          firstName: firstName?.trim() || 'Valued',
          lastName: lastName?.trim() || 'Customer',
          phone: phone?.trim() || '',
          customerType: 'NORMAL',
          status: 'ACTIVE',
          preferredLanguage: preferredLanguage || 'en',
          addresses: [],
        });
        console.log(`[MONGODB] Successfully created new user record in database: ${normalizedEmail}`);
      } else if (user.status === 'SUSPENDED') {
        return NextResponse.json(
          { error: 'Your account has been suspended. Please contact customer support.' },
          { status: 403 }
        );
      } else {
        // Update password and profile for existing user
        if (password) user.password = hashPassword(password);
        if (firstName?.trim()) user.firstName = firstName.trim();
        if (lastName?.trim()) user.lastName = lastName.trim();
        if (phone?.trim()) user.phone = phone.trim();
        if (preferredLanguage) user.preferredLanguage = preferredLanguage;
        await user.save();
        console.log(`[MONGODB] Updated existing user record & password in database: ${normalizedEmail}`);
      }

      userId = user._id.toString();
      customerType = user.customerType;
      userFirstName = user.firstName;
      userLastName = user.lastName;
    }

    // Generate JWT token using jose (edge-compatible)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }

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

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return NextResponse.json({
      message: 'Logged in successfully',
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
    console.error('Error verifying OTP API:', error);
    return NextResponse.json({ error: 'Failed to verify code. Please try again.' }, { status: 500 });
  }
}
