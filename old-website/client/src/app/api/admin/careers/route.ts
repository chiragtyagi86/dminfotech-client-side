// app/api/admin/careers/route.ts
// GET  /api/admin/careers  → all jobs with application counts
// POST /api/admin/careers  → create new job listing

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const [rows] = await pool.query<any[]>(
      `SELECT j.*,
              COUNT(a.id) AS _applicationCount
       FROM job_listings j
       LEFT JOIN job_applications a ON a.job_id = j.id
       GROUP BY j.id
       ORDER BY j.sort_order ASC, j.created_at DESC`
    );
    return NextResponse.json({ jobs: rows });
  } catch (err) {
    console.error("[GET /api/admin/careers]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const {
      title, slug, department, location, location_type, job_type,
      salary_label, description, requirements, benefits,
      status, sort_order, meta_title, meta_description,
    } = body;

    if (!title?.trim()) return NextResponse.json({ message: "Title is required." }, { status: 400 });
    if (!slug?.trim())  return NextResponse.json({ message: "Slug is required."  }, { status: 400 });

    // Check slug uniqueness
    const [existing] = await pool.query<any[]>(
      "SELECT id FROM job_listings WHERE slug = ? LIMIT 1", [slug]
    );
    if ((existing as any[]).length > 0)
      return NextResponse.json({ message: "A job with this slug already exists." }, { status: 409 });

    const [result] = await pool.query<any>(
      `INSERT INTO job_listings
       (title, slug, department, location, location_type, job_type,
        salary_label, description, requirements, benefits,
        status, sort_order, meta_title, meta_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(), slug.trim(),
        department || null, location || null,
        location_type || "onsite", job_type || "full-time",
        salary_label || null, description || null,
        requirements || null, benefits || null,
        status || "draft", sort_order ?? 0,
        meta_title || null, meta_description || null,
      ]
    );

    return NextResponse.json({ id: result.insertId, message: "Job created." }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/careers]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}