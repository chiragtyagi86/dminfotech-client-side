// src/app/api/admin/services/[slug]/route.ts
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
      "SELECT * FROM services WHERE slug = ?", [slug]
    );
    if (!(rows as any[]).length) {
      return NextResponse.json({ message: "Service not found." }, { status: 404 });
    }

    const svc     = (rows as any[])[0];
    const content = safeParseContent(svc.content);

    return NextResponse.json({
      ...svc,
      // Spread stored content fields back out for ServiceForm
      ...content,
      // Map DB columns to ServiceForm field names
      desc:           svc.short_desc,
      seoTitle:       svc.meta_title,
      seoDescription: svc.meta_description,
      order:          svc.sort_order,
      status:         svc.status === "published" ? "active" : "inactive",
    });
  } catch (err) {
    console.error("[services/:slug/GET]", err);
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
      "SELECT id FROM services WHERE slug = ?", [slug]
    );
    if (!(existing as any[]).length) {
      return NextResponse.json({ message: "Service not found." }, { status: 404 });
    }

    const svc  = (existing as any[])[0];
    const body = await request.json();

    const title            = body.title            || "";
    const short_desc       = body.desc             || body.short_desc       || "";
    const content          = buildContent(body);
    const icon             = body.icon             || "";
    const image            = body.image            || "";
    const sort_order       = body.order            || body.sort_order       || 1;
    const status           = body.status === "active" ? "published" : "draft";
    const meta_title       = body.seoTitle         || body.meta_title       || "";
    const meta_description = body.seoDescription   || body.meta_description || "";

    if (!title.trim()) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    let newSlug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
    if (newSlug !== slug) {
      const [slugCheck] = await pool.query<any[]>(
        "SELECT id FROM services WHERE slug = ? AND id != ?", [newSlug, svc.id]
      );
      if ((slugCheck as any[]).length) newSlug = `${newSlug}-${Date.now()}`;
    }

    await pool.query(
      `UPDATE services SET
         title = ?, slug = ?, short_desc = ?, content = ?,
         icon = ?, image = ?, sort_order = ?, status = ?,
         meta_title = ?, meta_description = ?
       WHERE id = ?`,
      [title.trim(), newSlug, short_desc, content, icon, image,
       sort_order, status, meta_title, meta_description, svc.id]
    );

    return NextResponse.json({ slug: newSlug });
  } catch (err) {
    console.error("[services/:slug/PUT]", err);
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
      "DELETE FROM services WHERE slug = ?", [slug]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Service not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[services/:slug/DELETE]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

function buildContent(body: any) {
  return JSON.stringify({
    num:        body.num        || "",
    tag:        body.tag        || "",
    tagline:    body.tagline    || "",
    features:   body.features   || "",
    keywords:   body.keywords   || "",
    accent:     body.accent     || "",
    subtitle:   body.subtitle   || "",
    fullDesc:   body.fullDesc   || "",
    highlights: body.highlights || [],
  });
}

function safeParseContent(raw: any) {
  try { return typeof raw === "string" ? JSON.parse(raw) : (raw || {}); }
  catch { return {}; }
}