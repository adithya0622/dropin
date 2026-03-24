import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const secret =
    process.env.NEXTAUTH_SECRET ||
    "auristra26-universal-auth-2026-super-secret-key";

  const pathname = request.nextUrl.pathname;

  // Static/API routes that don't need protection
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.webmanifest"
  ) {
    return NextResponse.next();
  }

  try {
    // Get JWT token from request
    const token = await getToken({
      req: request,
      secret,
      secureCookie: process.env.NODE_ENV === "production",
    });

    // Public routes - always accessible
    const publicRoutes = ["/", "/login", "/register", "/demo", "/leaderboard", "/api/health"];
    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // Protected routes - require authentication
    const protectedRoutes = ["/dashboard", "/profile", "/challenges"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Log for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("Middleware check:", {
        pathname,
        hasToken: !!token,
        isPublicRoute,
        isProtectedRoute,
      });
    }

    // If trying to access protected route without auth, redirect to home
    if (isProtectedRoute && !token) {
      console.log(`Redirecting ${pathname} to / (no token)`);
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow access to login/register
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, allow the request to proceed (fail open)
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Protected routes
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/challenges",
    "/challenges/:path*",
    // Public routes that need checking
    "/",
    "/login",
    "/register",
    "/demo",
    "/demo/:path*",
    "/leaderboard",
    "/leaderboard/:path*",
  ],
};
