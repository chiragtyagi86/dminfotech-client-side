// app/api/admin/careers/[id]/applications/route.ts
// GET   /api/admin/careers/[id]/applications  → list applications for a job
// PATCH /api/admin/careers/[id]/applications  → update application status

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../../../lib/db";
import { requireAdmin } from "../../../../../../../lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const [job] = await pool.query<any[]>(
      "SELECT id, title, slug, status FROM job_listings WHERE id = ? LIMIT 1", [id]
    );
    if (!(job as any[]).length)
      return NextResponse.json({ message: "Job not found." }, { status: 404 });

    const [apps] = await pool.query<any[]>(
      `SELECT id, name, email, phone, linkedin_url, resume_url, resume_name,
              status, notes, created_at
       FROM job_applications
       WHERE job_id = ?
       ORDER BY created_at DESC`,
      [id]
    );

    return NextResponse.json({
      job: (job as any[])[0],
      applications: apps,
    });
  } catch (err) {
    console.error("[GET /api/admin/careers/[id]/applications]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { appId, status, notes } = await request.json();
    const allowed = ["new", "reviewing", "shortlisted", "rejected", "hired"];

    if (!appId) return NextResponse.json({ message: "appId required." }, { status: 400 });
    if (status && !allowed.includes(status))
      return NextResponse.json({ message: "Invalid status." }, { status: 400 });

    const updates: string[] = [];
    const values:  any[]    = [];

    if (status !== undefined) { updates.push("status = ?"); values.push(status); }
    if (notes  !== undefined) { updates.push("notes = ?");  values.push(notes);  }

    if (!updates.length)
      return NextResponse.json({ message: "Nothing to update." }, { status: 400 });

    updates.push("updated_at = NOW()");
    values.push(appId);

    await pool.query(
      `UPDATE job_applications SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({ message: "Application updated." });
  } catch (err) {
    console.error("[PATCH /api/admin/careers/[id]/applications]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}