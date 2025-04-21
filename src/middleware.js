import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/SignIn' || path === '/Signup';

  // Check for the authentication token in the request cookies
  const token = request.cookies.get('token')?.value || '';

  // Redirect logic
  if (!token && !isPublicPath) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/SignIn', request.url));
  }

  if (token && isPublicPath) {
    // Redirect to home if trying to access login/signup while authenticated
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/',
    '/Home/:path*',
    '/profile/:path*',
    '/listings/:path*',
    '/manage-listings/:path*',
    '/messages/:path*',
    '/requests/:path*',
    '/cart/:path*',
    '/SignIn',
    '/Signup',
  ],
};