// app/api/admin/leads/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET    /api/admin/leads/:id   → single lead
// PATCH  /api/admin/leads/:id   → update status
// DELETE /api/admin/leads/:id   → delete lead
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../../lib/db";
import { requireAdmin } from "../../../../../../lib/auth";

type Params = { params: { id: string } };
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    const [rows] = await pool.query<any[]>(
      `SELECT id, name, email, phone, message, source_page, inquiry_type, status,
              ip_address, user_agent, views, last_viewed_at, submitted_at
       FROM leads
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    const l = rows[0];

    // Increment views
    await pool.query(
      "UPDATE leads SET views = views + 1, last_viewed_at = NOW() WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      data: {
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        message: l.message,
        sourcePage: l.source_page,
        inquiryType: l.inquiry_type,
        status: l.status,
        ipAddress: l.ip_address,
        userAgent: l.user_agent,
        views: l.views + 1,
        lastViewedAt: l.last_viewed_at,
        submittedAt: l.submitted_at,
      },
    });
  } catch (err) {
    console.error("[leads/[id]/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["new", "contacted", "closed"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    // Check if lead exists
    const [existing] = await pool.query<any[]>(
      "SELECT id FROM leads WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    await pool.query(
      "UPDATE leads SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );

    return NextResponse.json({
      message: "Lead updated successfully",
      id,
    });
  } catch (err) {
    console.error("[leads/[id]/PUT]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;

    await pool.query("DELETE FROM leads WHERE id = ?", [id]);

    return NextResponse.json({
      message: "Lead deleted successfully",
      id,
    });
  } catch (err) {
    console.error("[leads/[id]/DELETE]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}