// src/app/api/admin/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import { slugify } from "../../../../../lib/slugify";

// ── GET — list all services ───────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const [rows] = await pool.query<any[]>(
      `SELECT id, title, slug, short_desc, icon, image, sort_order, status,
              meta_title, meta_description, created_at, updated_at
       FROM services
       ORDER BY sort_order ASC, created_at ASC`
    );
    return NextResponse.json({ data: rows, meta: { total: (rows as any[]).length } });
  } catch (err) {
    console.error("[services/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// ── POST — create service ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();

    const title            = body.title            || "";
    const short_desc       = body.desc             || body.short_desc       || "";
    const content          = buildContent(body);
    const icon             = body.icon             || "";
    const image            = body.image            || "";
    const sort_order       = body.order            || body.sort_order       || 1;
    const status           = body.status === "active" ? "published" : (body.status || "published");
    const meta_title       = body.seoTitle         || body.meta_title       || "";
    const meta_description = body.seoDescription   || body.meta_description || "";

    if (!title.trim()) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    let slug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
    const [existing] = await pool.query<any[]>(
      "SELECT id FROM services WHERE slug = ?", [slug]
    );
    if ((existing as any[]).length) slug = `${slug}-${Date.now()}`;

    const [result] = await pool.query<any>(
      `INSERT INTO services
         (title, slug, short_desc, content, icon, image, sort_order, status,
          meta_title, meta_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title.trim(), slug, short_desc, content, icon, image,
       sort_order, status, meta_title, meta_description]
    );

    return NextResponse.json({ id: result.insertId, slug }, { status: 201 });
  } catch (err) {
    console.error("[services/POST]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// Store ServiceForm rich fields as JSON in the content column
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