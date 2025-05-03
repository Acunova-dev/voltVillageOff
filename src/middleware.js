import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/SignIn' || path === '/Signup' || path === '/';

  // Check for the authentication token in the request cookies
  const token = request.cookies.get('token')?.value || '';

  if (!token && !isPublicPath) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/SignIn', request.url));
  }

  if (path === '/SignIn' && token) {
    // Only redirect from SignIn page if there's a token
    return NextResponse.redirect(new URL('/', request.url));
  }
  
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