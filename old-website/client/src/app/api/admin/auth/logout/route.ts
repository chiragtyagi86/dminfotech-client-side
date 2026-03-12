// app/api/admin/auth/logout/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Admin Logout API — clears the auth cookie
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // immediately expire
    path: "/",
  });

  return response;
}