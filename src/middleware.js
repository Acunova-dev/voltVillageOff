import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = ['/SignIn', '/Signup', '/', '/Home'];

  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith('/Home/')
  );
  
  // Check for the authentication token in the request cookies
  const token = request.cookies.get('token')?.value || '';

  // If no token and trying to access protected route, redirect to login
  // if (!token && !isPublicPath) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  // // If has token and trying to access auth pages, redirect to home
  // if (token && (path === '/SignIn' || path === '/Signup')) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }
  
  return NextResponse.next();
}

// Update matcher to include all paths that should be checked by middleware
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