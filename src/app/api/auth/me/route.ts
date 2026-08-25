import { NextResponse } from 'next/server';
import { getCurrentCustomer } from '@/lib/auth/auth';

export async function GET() {
  try {
    // Only reads the 'session' cookie (user), NOT admin_session
    // This keeps the store AuthContext fully decoupled from admin sessions
    const user = await getCurrentCustomer();
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
