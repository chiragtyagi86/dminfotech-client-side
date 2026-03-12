// app/api/admin/pages/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/admin/pages   → list all pages (search, pagination)
// POST /api/admin/pages   → create new page
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const offset = (page - 1) * limit;

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (search) {
      conditions.push("(slug LIKE ? OR title LIKE ? OR description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) AS total FROM pages ${where}`,
      params
    );
    const total = (countRows as any[])[0].total;

    const [rows] = await pool.query<any[]>(
      `SELECT id, slug, title, description, is_published, updated_at 
       FROM pages ${where} 
       ORDER BY slug ASC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      data: rows.map((p: any) => ({
        id: p.id,
        key: p.slug,
        slug: p.slug,
        title: p.title,
        description: p.description,
        href: `/admin/pages/${p.slug}`,
        isPublished: p.is_published,
        updatedAt: p.updated_at,
      })),
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[pages/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { slug, title, description, content } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { message: "slug and title are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const [existing] = await pool.query<any[]>(
      "SELECT id FROM pages WHERE slug = ?",
      [slug]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Page with this slug already exists" },
        { status: 409 }
      );
    }

    const contentJSON = JSON.stringify(content || {});

    const [result] = await pool.query(
      "INSERT INTO pages (slug, title, description, content, is_published) VALUES (?, ?, ?, ?, true)",
      [slug, title, description || "", contentJSON]
    );

    return NextResponse.json(
      {
        message: "Page created successfully",
        slug,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[pages/POST]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}