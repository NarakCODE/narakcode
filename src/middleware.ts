import { type NextRequest, NextResponse } from "next/server";

import { detectAttack } from "@/lib/security-patterns";

// Cookie name for tracking "busted" users
const BUSTED_COOKIE = "security_busted";

function generateNonce(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  for (let i = 0; i < 32; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

function getCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-eval' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https: data: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
}

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
    return NextResponse.redirect(new URL("/busted", request.url));
  }

  // Detect attack patterns
  const detection = detectAttack(request.nextUrl);

  if (detection.isAttack) {
    console.log(`🚨 Attack detected: ${detection.type} - ${detection.detail}`);

    const response = NextResponse.redirect(new URL("/busted", request.url));

    response.cookies.set(BUSTED_COOKIE, detection.type || "unknown", {
      httpOnly: true,
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  }

  // Generate CSP nonce
  const nonce = generateNonce();
  const csp = getCsp(nonce);

  // Pass nonce to layout via request header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);

  return response;
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
