import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import OTP from '@/models/OTP';
import User from '@/models/User';
import Admin from '@/models/Admin';
import { SignJWT } from 'jose';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { verifyInMemoryOtp } from '@/lib/auth/inMemoryOtp';

export async function POST(request: Request) {
  try {
    const { email, otp, password, firstName, lastName, phone, preferredLanguage } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const submittedOtp = otp.trim();

    // 1. PASSWORD-BASED LOGIN FLOW
    if (submittedOtp === 'PASSWORD_LOGIN') {
      if (!password) {
        return NextResponse.json({ error: 'Password is required to log in.' }, { status: 400 });
      }

      let userRole = 'CUSTOMER';
      let customerType = 'NORMAL';
      let userId = 'user_' + Date.now();
      let userFirstName = 'Valued';
      let userLastName = 'Customer';
      let authenticated = false;

      // Check for default admin credentials
      if (normalizedEmail === 'admin@ventershop.ca' && password === 'admin123') {
        userRole = 'SUPER_ADMIN';
        customerType = 'ADMIN';
        userId = 'admin_super_01';
        userFirstName = 'System';
        userLastName = 'Admin';
        authenticated = true;
      }

      try {
        await connectToDatabase();
        const adminRecord = await Admin.findOne({ email: normalizedEmail, isActive: true });
        if (adminRecord) {
          const isPasswordCorrect = verifyPassword(password, adminRecord.password);
          if (isPasswordCorrect) {
            userRole = adminRecord.role;
            customerType = 'ADMIN';
            userId = adminRecord._id.toString();
            userFirstName = adminRecord.firstName;
            userLastName = adminRecord.lastName;
            authenticated = true;
          }
        } else {
          const user = await User.findOne({ email: normalizedEmail });
          if (user) {
            if (user.status === 'SUSPENDED') {
              return NextResponse.json({ error: 'Your account has been suspended.' }, { status: 403 });
            }
            const isPasswordCorrect = verifyPassword(password, user.password);
            if (isPasswordCorrect) {
              userId = user._id.toString();
              customerType = user.customerType;
              userFirstName = user.firstName;
              userLastName = user.lastName;
              authenticated = true;
            }
          }
        }
      } catch (dbError) {
        console.warn('Database error during login, checking in-memory credentials:', dbError);
      }

      if (!authenticated) {
        return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
      }

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

    // 2. REGISTRATION / OTP VERIFICATION FLOW
    let otpValid = false;

    // Check in-memory OTP cache first
    if (verifyInMemoryOtp(normalizedEmail, submittedOtp)) {
      otpValid = true;
    } else {
      try {
        await connectToDatabase();
        const otpRecord = await OTP.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
        if (otpRecord && !otpRecord.verified && otpRecord.expiresAt > new Date() && otpRecord.otp === submittedOtp) {
          otpRecord.verified = true;
          await otpRecord.save();
          otpValid = true;
        }
      } catch (dbErr) {
        console.warn('DB error checking OTP record:', dbErr);
      }
    }

    if (!otpValid) {
      return NextResponse.json({ error: 'Invalid or expired verification code. Please request a new code.' }, { status: 400 });
    }

    let userRole = 'CUSTOMER';
    let customerType = 'NORMAL';
    let userId = 'usr_' + Date.now();
    let userFirstName = firstName?.trim() || 'Valued';
    let userLastName = lastName?.trim() || 'Customer';

    try {
      await connectToDatabase();
      const adminRecord = await Admin.findOne({ email: normalizedEmail, isActive: true });
      if (adminRecord) {
        userRole = adminRecord.role;
        customerType = 'ADMIN';
        userId = adminRecord._id.toString();
        userFirstName = adminRecord.firstName;
        userLastName = adminRecord.lastName;
      } else {
        let user = await User.findOne({ email: normalizedEmail });
        if (!user) {
          const rawPassword = password || 'VenterShop2026!';
          const hashedPassword = hashPassword(rawPassword);
          user = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            firstName: userFirstName,
            lastName: userLastName,
            phone: phone?.trim() || '',
            customerType: 'NORMAL',
            status: 'ACTIVE',
            preferredLanguage: preferredLanguage || 'en',
            addresses: [],
          });
        }
        if (user) {
          userId = user._id.toString();
          customerType = user.customerType;
          userFirstName = user.firstName;
          userLastName = user.lastName;
        }
      }
    } catch {
      // In-memory token generation
    }

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
    cookieStore.set('session', token, {
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
  } catch (error: any) {
    console.error('Error verifying OTP API:', error);
    return NextResponse.json({ error: 'Failed to verify code. Please try again.' }, { status: 500 });
  }
}
