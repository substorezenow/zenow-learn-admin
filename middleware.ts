import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/forgot-password', '/api/auth/login', '/api/auth/secure-login'];
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is trying to access protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/login',
    '/forgot-password'
  ]
};
