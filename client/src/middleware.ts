// middleware.ts
// ─────────────────────────────────────────────────────────────────────────────
// Protects all /admin/* routes except /admin/login.
// Verifies the JWT stored in the admin_token httpOnly cookie.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "change-this-secret-in-production-min32"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Always allow the login page
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Token invalid or expired — clear cookie and redirect
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    return response;
  }
}

export const config = {
  // Explicitly match all /admin paths
  matcher: ["/admin", "/admin/(.*)"],
};