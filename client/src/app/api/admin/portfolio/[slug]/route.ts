// src/app/api/admin/portfolio/[slug]/route.ts
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
      "SELECT * FROM portfolio_items WHERE slug = ?", [slug]
    );
    if (!(rows as any[]).length) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    const item    = (rows as any[])[0];
    const content = safeParseContent(item.content);

    return NextResponse.json({
      ...item,
      ...content,
      // Map DB columns to PortfolioForm field names
      desc:           item.short_desc,
      seoTitle:       item.meta_title,
      seoDescription: item.meta_description,
    });
  } catch (err) {
    console.error("[portfolio/:slug/GET]", err);
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
      "SELECT id FROM portfolio_items WHERE slug = ?", [slug]
    );
    if (!(existing as any[]).length) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    const item = (existing as any[])[0];
    const body = await request.json();

    const title            = body.title            || "";
    const short_desc       = body.desc             || body.short_desc       || "";
    const category         = body.category         || "";
    const image            = body.image            || "";
    const sort_order       = body.sort_order       || 1;
    const status           = body.status           || "draft";
    const meta_title       = body.seoTitle         || body.meta_title       || "";
    const meta_description = body.seoDescription   || body.meta_description || "";
    const content          = buildContent(body);

    if (!title.trim()) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    let newSlug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
    if (newSlug !== slug) {
      const [slugCheck] = await pool.query<any[]>(
        "SELECT id FROM portfolio_items WHERE slug = ? AND id != ?",
        [newSlug, item.id]
      );
      if ((slugCheck as any[]).length) newSlug = `${newSlug}-${Date.now()}`;
    }

    await pool.query(
      `UPDATE portfolio_items SET
         title = ?, slug = ?, category = ?, short_desc = ?, content = ?,
         image = ?, sort_order = ?, status = ?,
         meta_title = ?, meta_description = ?
       WHERE id = ?`,
      [title.trim(), newSlug, category, short_desc, content,
       image, sort_order, status, meta_title, meta_description, item.id]
    );

    return NextResponse.json({ slug: newSlug });
  } catch (err) {
    console.error("[portfolio/:slug/PUT]", err);
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
      "DELETE FROM portfolio_items WHERE slug = ?", [slug]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[portfolio/:slug/DELETE]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

function buildContent(body: any) {
  return JSON.stringify({
    industry:         body.industry         || "",
    accent:           body.accent           || "",
    year:             body.year             || "",
    featured:         body.featured         || false,
    projectLink:      body.projectLink      || "",
    caseStudyEnabled: body.caseStudyEnabled || false,
    problem:          body.problem          || "",
    solution:         body.solution         || "",
    results:          body.results          || [],
  });
}

function safeParseContent(raw: any) {
  try { return typeof raw === "string" ? JSON.parse(raw) : (raw || {}); }
  catch { return {}; }
}