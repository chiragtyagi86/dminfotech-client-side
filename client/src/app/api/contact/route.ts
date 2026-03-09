// app/api/contact/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact
// Public endpoint — no auth required.
// Saves contact form submission to leads table.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone = "", subject = "", message, inquiry_type = "" } = body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { message: "Name, email and message are required." },
        { status: 400 }
      );
    }

    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
    }

    // Get source page from referer header
    const source_page = request.headers.get("referer") || "";

    // Get IP (works behind proxies)
    const ip_address =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";

    await pool.query(
      `INSERT INTO leads (name, email, phone, subject, message, inquiry_type, source_page, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), email.trim(), phone.trim(), subject.trim(),
       message.trim(), inquiry_type, source_page, ip_address]
    );

    return NextResponse.json(
      { success: true, message: "Thank you! We will be in touch soon." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[contact/POST]", err);
    return NextResponse.json({ message: "Server error. Please try again." }, { status: 500 });
  }
}