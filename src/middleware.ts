import { type NextRequest, NextResponse } from "next/server";

import { detectAttack } from "@/lib/security-patterns";

// Cookie name for tracking "busted" users
const BUSTED_COOKIE = "security_busted";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and the busted page itself
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/busted") ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    pathname === "/apple-touch-icon.png" ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/svgs") ||
    pathname.startsWith("/r/")
  ) {
    return NextResponse.next();
  }

  // Check if user was already busted
  const wasBusted = request.cookies.get(BUSTED_COOKIE);
  if (wasBusted) {
    // They've been caught before - redirect to busted page
    return NextResponse.redirect(new URL("/busted", request.url));
  }

  // Detect attack patterns
  const detection = detectAttack(request.nextUrl);

  if (detection.isAttack) {
    // Log the attack attempt (for fun - you could display this later)
    console.log(`🚨 Attack detected: ${detection.type} - ${detection.detail}`);

    // Create redirect response
    const response = NextResponse.redirect(new URL("/busted", request.url));

    // Set cookie so they stay busted (expires in 1 hour - not too harsh)
    response.cookies.set(BUSTED_COOKIE, detection.type || "unknown", {
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
