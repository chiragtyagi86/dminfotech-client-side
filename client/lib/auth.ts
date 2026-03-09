// lib/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Auth helpers for API route handlers.
// Usage:
//   const admin = await requireAdmin(request);
//   if (!admin.ok) return admin.response;
// ─────────────────────────────────────────────────────────────────────────────

import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "change-this-secret-in-production-min32"
);

type AdminPayload = {
  email: string;
  role:  string;
};

type AuthResult =
  | { ok: true;  payload: AdminPayload }
  | { ok: false; response: NextResponse };

/**
 * Call at the top of any protected API route handler.
 * Returns the decoded JWT payload if valid, or a 401 response to return early.
 *
 * Example:
 *   const auth = await requireAdmin(request);
 *   if (!auth.ok) return auth.response;
 *   // auth.payload.email is available here
 */
export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorised." }, { status: 401 }),
    };
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      ok: true,
      payload: payload as unknown as AdminPayload,
    };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ message: "Invalid or expired token." }, { status: 401 }),
    };
  }
}