// app/api/admin/seo/[type]/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/seo/page/[id]   → update page SEO settings
// PUT /api/admin/seo/blog/[id]   → update blog post SEO settings
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../../../lib/db";
import { requireAdmin } from "../../../../../../../lib/auth";

interface RouteParams {
  params: Promise<{ type: string; id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { type, id } = await params;
    const body = await request.json();
    const {
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      indexEnabled,
      keywords,
    } = body;

    // Validate type
    if (!["page", "blog"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid type. Must be 'page' or 'blog'." },
        { status: 400 }
      );
    }

    const table = type === "page" ? "page_seo" : "blog_seo";
    const idColumn = type === "page" ? "page_id" : "blog_id";
    const dataTable = type === "page" ? "pages" : "blog_posts";

    // Check if item exists
    const [existing] = await pool.query<any[]>(
      `SELECT id FROM ${dataTable} WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { message: `${type === "page" ? "Page" : "Blog post"} not found` },
        { status: 404 }
      );
    }

    // Check if SEO record exists
    const [seoCheck] = await pool.query<any[]>(
      `SELECT id FROM ${table} WHERE ${idColumn} = ?`,
      [id]
    );

    if (seoCheck.length === 0) {
      // Insert new SEO record
      await pool.query(
        `INSERT INTO ${table} (${idColumn}, meta_title, meta_description, canonical_url, og_title, og_description, og_image, index_enabled, keywords)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          metaTitle || null,
          metaDescription || null,
          canonicalUrl || null,
          ogTitle || null,
          ogDescription || null,
          ogImage || null,
          indexEnabled !== false,
          keywords || null,
        ]
      );
    } else {
      // Update existing SEO record
      await pool.query(
        `UPDATE ${table}
         SET meta_title = ?, meta_description = ?, canonical_url = ?,
             og_title = ?, og_description = ?, og_image = ?,
             index_enabled = ?, keywords = ?, updated_at = NOW()
         WHERE ${idColumn} = ?`,
        [
          metaTitle || null,
          metaDescription || null,
          canonicalUrl || null,
          ogTitle || null,
          ogDescription || null,
          ogImage || null,
          indexEnabled !== false,
          keywords || null,
          id,
        ]
      );
    }

    return NextResponse.json({
      message: `SEO settings updated for ${type === "page" ? "page" : "blog post"} successfully`,
      id,
    });
  } catch (err) {
    console.error("[seo/[type]/[id]/PUT]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}