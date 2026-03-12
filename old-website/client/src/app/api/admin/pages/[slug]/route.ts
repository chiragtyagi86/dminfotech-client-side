// app/api/admin/pages/[slug]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET    /api/admin/pages/[slug]   → get page content by slug
// PUT    /api/admin/pages/[slug]   → update page content
// DELETE /api/admin/pages/[slug]   → delete page (except core pages)
// ─────────────────────────────────────────────────────────────────────────────

// app/api/admin/pages/[slug]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET    /api/admin/pages/[slug]   → get page content by slug
// PUT    /api/admin/pages/[slug]   → update page content
// DELETE /api/admin/pages/[slug]   → delete page (except core pages)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../../lib/db";
import { requireAdmin } from "../../../../../../lib/auth";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

const CORE_PAGES = ["home", "about", "contact"];

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { slug } = await params;

    const [rows] = await pool.query<any[]>(
      `SELECT id, slug, title, description, content, is_published 
       FROM pages 
       WHERE slug = ?`,
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const page = rows[0];
    const content =
      typeof page.content === "string" ? JSON.parse(page.content) : page.content;

    return NextResponse.json({
      data: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        description: page.description,
        content,
        isPublished: page.is_published,
      },
    });
  } catch (err) {
    console.error("[pages/[slug]/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { slug } = await params;
    const body = await request.json();
    const { content, title, description } = body;

    // Check if page exists
    const [existing] = await pool.query<any[]>(
      "SELECT id FROM pages WHERE slug = ?",
      [slug]
    );

    if (existing.length === 0) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const contentJSON = JSON.stringify(content);

    await pool.query(
      "UPDATE pages SET content = ?, title = ?, description = ?, updated_at = NOW() WHERE slug = ?",
      [contentJSON, title, description, slug]
    );

    return NextResponse.json({
      message: "Page updated successfully",
      slug,
    });
  } catch (err) {
    console.error("[pages/[slug]/PUT]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { slug } = await params;

    // Prevent deleting core pages
    if (CORE_PAGES.includes(slug)) {
      return NextResponse.json(
        { message: "Cannot delete core pages (home, about, contact)" },
        { status: 403 }
      );
    }

    const [result] = await pool.query(
      "DELETE FROM pages WHERE slug = ?",
      [slug]
    );

    return NextResponse.json({
      message: "Page deleted successfully",
      slug,
    });
  } catch (err) {
    console.error("[pages/[slug]/DELETE]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}