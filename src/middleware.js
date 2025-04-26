import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/SignIn' || path === '/Signup';

  // Check for the authentication token in the request cookies
  const token = request.cookies.get('token')?.value || '';

  // TEMPORARILY BYPASSING AUTHENTICATION
  // Original authentication logic commented out for development
  /*
  if (!token && !isPublicPath) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/SignIn', request.url));
  }

  if (token && isPublicPath) {
    // Redirect to home if trying to access login/signup while authenticated
    return NextResponse.redirect(new URL('/', request.url));
  }
  */
  
  // Always continue to the requested page
  return NextResponse.next();
}

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