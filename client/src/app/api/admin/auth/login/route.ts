// app/api/admin/auth/login/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Admin Login API
// Validates credentials against env vars, sets a signed JWT in an httpOnly
// cookie. Replace env-var check with DB lookup when ready.
//
// Required env vars (.env.local):
//   ADMIN_EMAIL=admin@dhanamitra.com
//   ADMIN_PASSWORD=your-secure-password
//   ADMIN_JWT_SECRET=your-random-secret-min-32-chars
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "change-this-secret-in-production-min32"
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const validEmail    = process.env.ADMIN_EMAIL    || "admin@dhanamitra.com";
    const validPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email !== validEmail || password !== validPassword) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Sign JWT — expires in 24 hours
    const token = await new SignJWT({ email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true });

    // Set httpOnly cookie — not accessible from JS
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}