import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import User from '@/models/User';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || '';

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  customerType: 'NORMAL' | 'COMMUNITY' | 'WHOLESALE' | 'ADMIN';
  firstName: string;
  lastName: string;
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    // Check admin_session first (for admin routes), then user session
    const adminToken = cookieStore.get('admin_session')?.value;
    const userToken = cookieStore.get('session')?.value;
    const token = adminToken || userToken;

    if (!token) return null;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

// Specifically get the user (non-admin) session payload
export async function getUserSessionPayload(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    await connectToDatabase();
    const session = await getSessionPayload();

    if (!session) return null;

    if (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN') {
      const admin = await Admin.findById(session.userId);
      if (!admin || !admin.isActive) return null;
      return {
        id: admin._id.toString(),
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        customerType: 'ADMIN' as const,
      };
    } else {
      const user = await User.findById(session.userId);
      if (!user || user.status === 'SUSPENDED') return null;
      return {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'CUSTOMER' as const,
        customerType: user.customerType,
        communityId: user.communityId?.toString() || null,
        communityStatus: user.communityStatus,
        preferredLanguage: user.preferredLanguage,
        addresses: user.addresses,
      };
    }
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Gets the currently logged-in CUSTOMER only (reads 'session' cookie).
 * Admin sessions (admin_session cookie) are intentionally excluded here.
 * Use this in all /api/customer/* routes to prevent admin cookie from acting as customer.
 */
export async function getCurrentCustomer() {
  try {
    await connectToDatabase();
    const session = await getUserSessionPayload();
    if (!session) return null;

    // Reject if this session belongs to an admin
    if (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN') return null;

    const user = await User.findById(session.userId);
    if (!user || user.status === 'SUSPENDED') return null;
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: 'CUSTOMER' as const,
      customerType: user.customerType,
      communityId: user.communityId?.toString() || null,
      communityStatus: user.communityStatus,
      preferredLanguage: user.preferredLanguage,
      addresses: user.addresses,
    };
  } catch (error) {
    console.error('Error fetching current customer:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    throw new Error('Forbidden');
  }
  return user;
}
