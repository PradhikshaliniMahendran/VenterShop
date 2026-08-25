import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import OTP from '@/models/OTP';
import { sendEmail } from '@/lib/nodemailer/nodemailer';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check rate limit: 60 seconds cooldown between OTP requests
    const lastOtp = await OTP.findOne({
      email: normalizedEmail,
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    });

    if (lastOtp) {
      return NextResponse.json(
        { error: 'Please wait 60 seconds before requesting another code' },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Save OTP to DB
    await OTP.create({
      email: normalizedEmail,
      otp: otpCode,
      expiresAt,
    });

    // Send email with premium HTML layout
    const subject = `Your VENTERSHOP Verification Code: ${otpCode}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a2a4a; padding-bottom: 15px;">
          <h1 style="color: #1a2a4a; margin: 0; font-size: 28px; letter-spacing: 1px;">VENTERSHOP</h1>
          <p style="color: #E53935; margin: 5px 0 0; font-size: 13px; font-weight: bold; letter-spacing: 0.5px;">Your Trusted Online Store for Quality Products</p>
        </div>
        <div style="padding: 25px; background-color: #f9fafb; border-radius: 6px; text-align: center;">
          <p style="color: #333333; font-size: 16px; margin-top: 0; text-align: left;">Hello,</p>
          <p style="color: #333333; font-size: 16px; text-align: left; line-height: 1.5;">Use the following verification code to log in or register your account on the VENTERSHOP platform:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1a2a4a; margin: 25px 0; padding: 15px; background-color: #ffffff; border: 1px dashed #E5E7EB; border-radius: 6px; display: inline-block;">
            ${otpCode}
          </div>
          <p style="color: #6b7280; font-size: 13px; margin-top: 15px;">This code is valid for <strong>5 minutes</strong> and can only be used once.</p>
        </div>
        <div style="margin-top: 25px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #E5E7EB; padding-top: 15px;">
          <p style="margin: 0 0 5px;">This is an automated message, please do not reply directly to this email.</p>
          <p style="margin: 0; font-weight: bold;">© 2026 VENTERSHOP Canada. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: normalizedEmail,
      subject,
      html: emailHtml,
    });

    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.SMTP_USER || process.env.SMTP_USER === 'placeholder';

    console.log('========================================================================');
    console.log(`[GENERATED OTP CODE FOR ${normalizedEmail}]: ${otpCode}`);
    console.log('========================================================================');

    return NextResponse.json({
      message: 'Verification code sent successfully',
      debugOtp: isDevelopment ? otpCode : undefined,
    });
  } catch (error: any) {
    console.error('Error sending OTP API:', error);
    return NextResponse.json({ error: 'Failed to send verification code. Please try again.' }, { status: 500 });
  }
}
