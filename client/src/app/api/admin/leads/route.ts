// app/api/admin/leads/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/admin/leads   → list leads (filter by status, search)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "30");
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";
  const offset = (page - 1) * limit;

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status && status !== "all") {
      conditions.push("status = ?");
      params.push(status);
    }

    if (search) {
      conditions.push("(name LIKE ? OR email LIKE ? OR message LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) AS total FROM leads ${where}`,
      params
    );
    const total = (countRows as any[])[0].total;

    const [rows] = await pool.query<any[]>(
      `SELECT id, name, email, phone, message, source_page, inquiry_type, status,
              ip_address, views, submitted_at
       FROM leads ${where}
       ORDER BY submitted_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      data: rows.map((l: any) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        message: l.message,
        sourcePage: l.source_page,
        inquiryType: l.inquiry_type,
        status: l.status,
        ipAddress: l.ip_address,
        views: l.views,
        submittedAt: l.submitted_at,
      })),
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[leads/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, sourcePage, inquiryType } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "name, email, and message are required" },
        { status: 400 }
      );
    }

    // Get client IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "";

    const [result] = await pool.query(
      `INSERT INTO leads (name, email, phone, message, source_page, inquiry_type, ip_address, user_agent, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        name,
        email,
        phone || null,
        message,
        sourcePage || null,
        inquiryType || null,
        ip,
        userAgent,
      ]
    );

    const insertId = (result as any).insertId;

    return NextResponse.json(
      {
        message: "Lead created successfully",
        id: insertId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[leads/POST]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}