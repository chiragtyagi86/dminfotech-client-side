// src/app/api/admin/portfolio/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import { slugify } from "../../../../../lib/slugify";

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const [rows] = await pool.query<any[]>(
      `SELECT id, title, slug, category, short_desc, image, sort_order, status,
              meta_title, meta_description, created_at, updated_at
       FROM portfolio_items
       ORDER BY sort_order ASC, created_at DESC`
    );
    return NextResponse.json({ data: rows, meta: { total: (rows as any[]).length } });
  } catch (err) {
    console.error("[portfolio/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();

    const title            = body.title            || "";
    const short_desc       = body.desc             || body.short_desc       || "";
    const category         = body.category         || "";
    const image            = body.image            || "";
    const sort_order       = body.sort_order       || 1;
    const status           = body.status           || "draft";
    const meta_title       = body.seoTitle         || body.meta_title       || "";
    const meta_description = body.seoDescription   || body.meta_description || "";
    const gallery          = JSON.stringify([]);
    const content          = buildContent(body);

    if (!title.trim()) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    let slug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
    const [existing] = await pool.query<any[]>(
      "SELECT id FROM portfolio_items WHERE slug = ?", [slug]
    );
    if ((existing as any[]).length) slug = `${slug}-${Date.now()}`;

    const [result] = await pool.query<any>(
      `INSERT INTO portfolio_items
         (title, slug, category, short_desc, content, image, gallery,
          sort_order, status, meta_title, meta_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title.trim(), slug, category, short_desc, content, image,
       gallery, sort_order, status, meta_title, meta_description]
    );

    return NextResponse.json({ id: result.insertId, slug }, { status: 201 });
  } catch (err) {
    console.error("[portfolio/POST]", err);
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