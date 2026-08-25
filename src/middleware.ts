import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;

  const isAdminLoginPath = pathname === '/admin/login';
  const isAdminPath = pathname.startsWith('/admin') && !isAdminLoginPath;
  const isDashboardPath = pathname.startsWith('/dashboard');
  const isCheckoutPath = pathname.startsWith('/checkout');

  // --- ADMIN ROUTE PROTECTION (uses admin_session cookie) ---
  if (isAdminPath) {
    const adminToken = request.cookies.get('admin_session')?.value;
    if (!adminToken) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(adminToken, secret);
      if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') {
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      url.pathname = '/admin/login';
      const response = NextResponse.redirect(url);
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // --- CUSTOMER ROUTE PROTECTION (uses session cookie only) ---
  if (isDashboardPath || isCheckoutPath) {
    const userToken = request.cookies.get('session')?.value;
    if (!userToken) {
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(userToken, secret);
      // Reject admin cookies on customer routes
      if (payload.role === 'ADMIN' || payload.role === 'SUPER_ADMIN') {
        url.pathname = '/login';
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }
    } catch (error) {
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      const response = NextResponse.redirect(url);
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: ['/admin', '/admin/((?!login).*)', '/dashboard/:path*', '/checkout/:path*'],
};
