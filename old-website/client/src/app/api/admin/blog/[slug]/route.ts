// src/app/api/admin/blog/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../../lib/db";
import { requireAdmin } from "../../../../../../lib/auth";
import { slugify } from "../../../../../../lib/slugify";

type Params = { params: Promise<{ slug: string }> };

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { slug } = await params;

  try {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM blog_posts WHERE slug = ?", [slug]
    );
    if (!(rows as any[]).length) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    const post = (rows as any[])[0];
    return NextResponse.json({
      ...post,
      featuredImage:  post.cover_image,
      seoTitle:       post.meta_title,
      seoDescription: post.meta_description,
      ogImage:        post.og_image,
    });
  } catch (err) {
    console.error("[blog/:slug/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// ── PUT ───────────────────────────────────────────────────────────────────────
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { slug } = await params;

  try {
    const [existing] = await pool.query<any[]>(
      "SELECT id, status FROM blog_posts WHERE slug = ?", [slug]
    );
    if (!(existing as any[]).length) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    const post = (existing as any[])[0];
    const body = await request.json();

    const title            = body.title            || "";
    const excerpt          = body.excerpt          ?? "";
    const content          = body.content          ?? "";
    const status           = body.status           || post.status;
    const publishDate      = body.publishDate      || null;
    const cover_image      = body.featuredImage    || body.cover_image      || "";
    const meta_title       = body.seoTitle         || body.meta_title       || "";
    const meta_description = body.seoDescription   || body.meta_description || "";
    const og_image         = body.ogImage          || body.og_image         || "";

    if (!title.trim()) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    let newSlug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
    if (newSlug !== slug) {
      const [slugCheck] = await pool.query<any[]>(
        "SELECT id FROM blog_posts WHERE slug = ? AND id != ?",
        [newSlug, post.id]
      );
      if ((slugCheck as any[]).length) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    let published_at = body.published_at ?? null;
    if (status === "published" && post.status !== "published") {
      published_at = publishDate ? new Date(publishDate) : new Date();
    }

    await pool.query(
      `UPDATE blog_posts SET
         title = ?, slug = ?, excerpt = ?, content = ?,
         cover_image = ?, status = ?, published_at = ?,
         meta_title = ?, meta_description = ?, og_image = ?
       WHERE id = ?`,
      [title.trim(), newSlug, excerpt, content, cover_image,
       status, published_at, meta_title, meta_description, og_image,
       post.id]
    );

    return NextResponse.json({ slug: newSlug });
  } catch (err) {
    console.error("[blog/:slug/PUT]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { slug } = await params;

  try {
    const [result] = await pool.query<any>(
      "DELETE FROM blog_posts WHERE slug = ?", [slug]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[blog/:slug/DELETE]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}