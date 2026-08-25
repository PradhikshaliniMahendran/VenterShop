import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import User from '@/models/User';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'ventershop_development_secret_key_change_me_in_production';

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
    const session = await getSessionPayload();
    if (!session) return null;

    let dbRecord: any = null;
    try {
      await connectToDatabase();
      if (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN') {
        dbRecord = await Admin.findById(session.userId);
      } else {
        dbRecord = await User.findById(session.userId);
      }
    } catch (dbErr) {
      console.warn('Database error in getCurrentUser, falling back to JWT session payload:', dbErr);
    }

    if (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN') {
      if (dbRecord && !dbRecord.isActive) return null;
      return {
        id: dbRecord ? dbRecord._id.toString() : session.userId,
        email: dbRecord?.email || session.email,
        firstName: dbRecord?.firstName || session.firstName || 'System',
        lastName: dbRecord?.lastName || session.lastName || 'Admin',
        role: (dbRecord?.role || session.role) as 'ADMIN' | 'SUPER_ADMIN',
        customerType: 'ADMIN' as const,
      };
    } else {
      if (dbRecord && dbRecord.status === 'SUSPENDED') return null;
      return {
        id: dbRecord ? dbRecord._id.toString() : session.userId,
        email: dbRecord?.email || session.email,
        firstName: dbRecord?.firstName || session.firstName || 'Valued',
        lastName: dbRecord?.lastName || session.lastName || 'Customer',
        role: 'CUSTOMER' as const,
        customerType: (dbRecord?.customerType || session.customerType || 'NORMAL') as any,
        communityId: dbRecord?.communityId?.toString() || null,
        communityStatus: dbRecord?.communityStatus || 'NONE',
        preferredLanguage: dbRecord?.preferredLanguage || 'en',
        addresses: dbRecord?.addresses || [],
      };
    }
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function getCurrentCustomer() {
  try {
    const session = await getUserSessionPayload();
    if (!session) return null;

    if (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN') return null;

    let user: any = null;
    try {
      await connectToDatabase();
      user = await User.findById(session.userId);
    } catch (dbErr) {
      console.warn('Database error in getCurrentCustomer, falling back to JWT session payload:', dbErr);
    }

    if (user && user.status === 'SUSPENDED') return null;

    return {
      id: user ? user._id.toString() : session.userId,
      email: user?.email || session.email,
      firstName: user?.firstName || session.firstName || 'Valued',
      lastName: user?.lastName || session.lastName || 'Customer',
      role: 'CUSTOMER' as const,
      customerType: (user?.customerType || session.customerType || 'NORMAL') as any,
      communityId: user?.communityId?.toString() || null,
      communityStatus: user?.communityStatus || 'NONE',
      preferredLanguage: user?.preferredLanguage || 'en',
      addresses: user?.addresses || [],
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
