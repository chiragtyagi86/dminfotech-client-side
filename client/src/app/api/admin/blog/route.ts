// src/app/api/admin/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import { slugify } from "../../../../../lib/slugify";

// ── GET — list posts ──────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = request.nextUrl;
  const page   = parseInt(searchParams.get("page")  || "1");
  const limit  = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const offset = (page - 1) * limit;

  try {
    const conditions: string[] = [];
    const params: unknown[]    = [];

    if (search) {
      conditions.push("(title LIKE ? OR excerpt LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) AS total FROM blog_posts ${where}`, params
    );
    const total = (countRows as any[])[0].total;

    const [rows] = await pool.query<any[]>(
      `SELECT id, title, slug, excerpt, cover_image, status, published_at,
              meta_title, meta_description, created_at, updated_at
       FROM blog_posts ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      data: rows,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[blog/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// ── POST — create post ────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();

    // Support both BlogForm field names AND direct API field names
    const title            = body.title            || "";
    const excerpt          = body.excerpt           || "";
    const content          = body.content           || "";
    const status           = body.status            || "draft";
    const publishDate      = body.publishDate       || null;

    // Image: BlogForm sends "featuredImage", direct API sends "cover_image"
    const cover_image      = body.featuredImage     || body.cover_image      || "";

    // SEO: BlogForm sends "seoTitle" etc, direct API sends "meta_title" etc
    const meta_title       = body.seoTitle          || body.meta_title       || "";
    const meta_description = body.seoDescription    || body.meta_description || "";
    const og_image         = body.ogImage           || body.og_image         || "";

    if (!title.trim()) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    // Auto-generate slug; ensure unique
    let slug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
    const [existing] = await pool.query<any[]>(
      "SELECT id FROM blog_posts WHERE slug = ?", [slug]
    );
    if ((existing as any[]).length) {
      slug = `${slug}-${Date.now()}`;
    }

    const published_at = status === "published"
      ? (publishDate ? new Date(publishDate) : new Date())
      : null;

    const [result] = await pool.query<any>(
      `INSERT INTO blog_posts
         (title, slug, excerpt, content, cover_image, status, published_at,
          meta_title, meta_description, og_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title.trim(), slug, excerpt, content, cover_image,
       status, published_at, meta_title, meta_description, og_image]
    );

    return NextResponse.json({ id: result.insertId, slug }, { status: 201 });
  } catch (err) {
    console.error("[blog/POST]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}