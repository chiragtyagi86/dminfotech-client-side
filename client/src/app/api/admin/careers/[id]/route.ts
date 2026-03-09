// app/api/admin/careers/[id]/route.ts
// GET    /api/admin/careers/[id]  → single job
// PUT    /api/admin/careers/[id]  → full update
// PATCH  /api/admin/careers/[id]  → partial update (status toggle)
// DELETE /api/admin/careers/[id]  → delete job + cascade applications

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../../lib/db";
import { requireAdmin } from "../../../../../../lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM job_listings WHERE id = ? LIMIT 1", [id]
    );
    if (!(rows as any[]).length)
      return NextResponse.json({ message: "Not found." }, { status: 404 });

    return NextResponse.json({ job: (rows as any[])[0] });
  } catch (err) {
    console.error("[GET /api/admin/careers/[id]]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      title, slug, department, location, location_type, job_type,
      salary_label, description, requirements, benefits,
      status, sort_order, meta_title, meta_description,
    } = body;

    if (!title?.trim()) return NextResponse.json({ message: "Title is required." }, { status: 400 });
    if (!slug?.trim())  return NextResponse.json({ message: "Slug is required."  }, { status: 400 });

    // Check slug uniqueness excluding current record
    const [existing] = await pool.query<any[]>(
      "SELECT id FROM job_listings WHERE slug = ? AND id != ? LIMIT 1", [slug, id]
    );
    if ((existing as any[]).length > 0)
      return NextResponse.json({ message: "Another job uses this slug." }, { status: 409 });

    await pool.query(
      `UPDATE job_listings SET
        title = ?, slug = ?, department = ?, location = ?,
        location_type = ?, job_type = ?, salary_label = ?,
        description = ?, requirements = ?, benefits = ?,
        status = ?, sort_order = ?,
        meta_title = ?, meta_description = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        title.trim(), slug.trim(),
        department || null, location || null,
        location_type || "onsite", job_type || "full-time",
        salary_label || null, description || null,
        requirements || null, benefits || null,
        status || "draft", sort_order ?? 0,
        meta_title || null, meta_description || null,
        id,
      ]
    );

    return NextResponse.json({ message: "Job updated." });
  } catch (err) {
    console.error("[PUT /api/admin/careers/[id]]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const body   = await request.json();
    const { status } = body;
    const allowed = ["open", "closed", "draft"];

    if (!allowed.includes(status))
      return NextResponse.json({ message: "Invalid status." }, { status: 400 });

    await pool.query(
      "UPDATE job_listings SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );

    return NextResponse.json({ message: "Status updated." });
  } catch (err) {
    console.error("[PATCH /api/admin/careers/[id]]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    // Applications cascade via FK — but delete explicitly for safety
    await pool.query("DELETE FROM job_applications WHERE job_id = ?", [id]);
    await pool.query("DELETE FROM job_listings WHERE id = ?", [id]);

    return NextResponse.json({ message: "Job deleted." });
  } catch (err) {
    console.error("[DELETE /api/admin/careers/[id]]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}