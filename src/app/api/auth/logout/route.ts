import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    // Clear both user and admin session cookies
    cookieStore.delete('session');
    cookieStore.delete('admin_session');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Failed to log out. Please try again.' }, { status: 500 });
  }
}
