import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@repo/auth';

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  // Skip middleware for health check
  if (request.nextUrl.pathname === '/health') {
    return NextResponse.next();
  }

  // Add common headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Rate limiting
  // TODO: Implement rate limiting using Redis or similar
  // This will be handled by a separate service

  // Request logging
  // TODO: Implement request logging
  // This will be handled by a separate service

  // Authentication for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    try {
      const session = await auth.getSession();
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  return response;
} 