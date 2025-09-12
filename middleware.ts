import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // For static export, we'll handle authentication client-side
  // This middleware just provides basic routing logic without server-side auth
  
  const response = NextResponse.next();
  
  // Add security headers
  // Allow iframe embedding for index.html (5GLabX platform)
  if (req.nextUrl.pathname === '/index.html') {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  } else {
    response.headers.set('X-Frame-Options', 'DENY');
  }
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};