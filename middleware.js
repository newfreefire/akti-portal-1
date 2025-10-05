import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function middleware(request) {
  // Get token from cookie (set by the API) or Authorization header (set by client-side code)
  const cookieToken = request.cookies.get('token')?.value;
  const authHeader = request.headers.get('Authorization');
  const headerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  
  // Use cookie token as primary, fallback to header token
  const token = cookieToken || headerToken;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isCsrRoute = pathname.startsWith('/csr');
  const isProtectedRoute = isAdminRoute || isCsrRoute;

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Verify the token
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);

    // Check permissions based on route
    if (isAdminRoute && !payload.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (isCsrRoute && !payload.isCSR && !payload.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/admin/:path*', '/csr/:path*'],
};