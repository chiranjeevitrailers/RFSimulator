import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the request is for a protected route
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/user-dashboard') || 
                          req.nextUrl.pathname.startsWith('/admin-dashboard') ||
                          req.nextUrl.pathname.startsWith('/profile') ||
                          req.nextUrl.pathname.startsWith('/settings');

  // Check if the request is for an admin-only route
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin-dashboard');

  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing admin route, check if user is admin
  if (isAdminRoute && session) {
    try {
      // Get user role from database
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userProfile?.role !== 'admin') {
        // Redirect non-admin users to user dashboard
        return NextResponse.redirect(new URL('/user-dashboard', req.url));
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      // If there's an error checking the role, redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If user is logged in and trying to access login/signup, redirect to dashboard
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    // Check if user is admin
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userProfile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin-dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/user-dashboard', req.url));
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      return NextResponse.redirect(new URL('/user-dashboard', req.url));
    }
  }

  return res;
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