// src/services/portfolio.service.ts

import db from "../config/db";
import { slugify } from "../utils/slugify";

function buildContent(body: any) {
  return JSON.stringify({
    industry: body.industry || "", accent: body.accent || "",
    year: body.year || "", featured: body.featured || false,
    projectLink: body.projectLink || "", caseStudyEnabled: body.caseStudyEnabled || false,
    problem: body.problem || "", solution: body.solution || "",
    results: body.results || [],
  });
}

function safeParseContent(raw: any) {
  try { return typeof raw === "string" ? JSON.parse(raw) : (raw || {}); }
  catch { return {}; }
}

// ── Public ────────────────────────────────────────────────────────────────────

export async function getAllPortfolioItems() {
  const [rows] = await db.query(
    `SELECT id, title, slug, category, short_desc, content, image, gallery,
            client, project_url, sort_order, status, meta_title, meta_description
     FROM portfolio_items WHERE status = 'published' ORDER BY sort_order ASC`
  );
  return rows;
}

export async function getPortfolioItemBySlug(slug: string) {
  const [rows] = await db.query<any[]>(
    `SELECT * FROM portfolio_items WHERE slug = ? AND status = 'published' LIMIT 1`, [slug]
  );
  return (rows as any[])[0] ?? null;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAdminPortfolio() {
  const [rows] = await db.query<any[]>(
    `SELECT id, title, slug, category, short_desc, image, sort_order, status,
            meta_title, meta_description, created_at, updated_at
     FROM portfolio_items ORDER BY sort_order ASC, created_at DESC`
  );
  return { data: rows, meta: { total: (rows as any[]).length } };
}

export async function getAdminPortfolioBySlug(slug: string) {
  const [rows] = await db.query<any[]>("SELECT * FROM portfolio_items WHERE slug = ?", [slug]);
  if (!(rows as any[]).length) throw Object.assign(new Error("Project not found."), { status: 404 });
  const item = rows[0];
  const content = safeParseContent(item.content);
  return { ...item, ...content, desc: item.short_desc, seoTitle: item.meta_title, seoDescription: item.meta_description };
}

export async function createPortfolioItem(body: any): Promise<{ id: number; slug: string }> {
  const title            = body.title            || "";
  const short_desc       = body.desc             || body.short_desc || "";
  const category         = body.category         || "";
  const image            = body.image            || "";
  const sort_order       = body.sort_order       || 1;
  const status           = body.status           || "draft";
  const meta_title       = body.seoTitle         || body.meta_title || "";
  const meta_description = body.seoDescription   || body.meta_description || "";
  const content          = buildContent(body);

  if (!title.trim()) throw Object.assign(new Error("Title is required."), { status: 400 });

  let slug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
  const [existing] = await db.query<any[]>("SELECT id FROM portfolio_items WHERE slug = ?", [slug]);
  if ((existing as any[]).length) slug = `${slug}-${Date.now()}`;

  const [result] = await db.query<any>(
    `INSERT INTO portfolio_items
     (title, slug, category, short_desc, content, image, gallery, sort_order, status, meta_title, meta_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title.trim(), slug, category, short_desc, content, image, JSON.stringify([]), sort_order, status, meta_title, meta_description]
  );
  return { id: result.insertId, slug };
}

export async function updatePortfolioItem(slug: string, body: any): Promise<{ slug: string }> {
  const [existing] = await db.query<any[]>("SELECT id FROM portfolio_items WHERE slug = ?", [slug]);
  if (!(existing as any[]).length) throw Object.assign(new Error("Project not found."), { status: 404 });

  const item  = (existing as any[])[0];
  const title = body.title || "";
  if (!title.trim()) throw Object.assign(new Error("Title is required."), { status: 400 });

  let newSlug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
  if (newSlug !== slug) {
    const [check] = await db.query<any[]>("SELECT id FROM portfolio_items WHERE slug = ? AND id != ?", [newSlug, item.id]);
    if ((check as any[]).length) newSlug = `${newSlug}-${Date.now()}`;
  }

  // Accept "published" directly — frontend sends "published" not "active"
  const status =
    body.status === "published" || body.status === "active" || body.published === true
      ? "published"
      : "draft";

  // If body.content is already a JSON string (sent by PortfolioForm), use it directly.
  // Passing it through buildContent would lose all fields since it expects loose body props.
  let contentValue: string;
  if (typeof body.content === "string" && body.content.trim().startsWith("{")) {
    contentValue = body.content;
  } else if (typeof body.content === "object" && body.content !== null) {
    contentValue = JSON.stringify(body.content);
  } else {
    contentValue = buildContent(body);
  }

  await db.query(
    `UPDATE portfolio_items SET title=?, slug=?, category=?, short_desc=?, content=?,
                                image=?, sort_order=?, status=?, meta_title=?, meta_description=?
     WHERE id=?`,
    [
      title.trim(),
      newSlug,
      body.category || "",
      body.short_desc || body.desc || "",
      contentValue,
      body.image || "",
      body.sort_order || 1,
      status,
      body.meta_title || body.seoTitle || "",
      body.meta_description || body.seoDescription || "",
      item.id,
    ]
  );

  return { slug: newSlug };
}

export async function deletePortfolioItem(slug: string): Promise<void> {
  const [result] = await db.query<any>("DELETE FROM portfolio_items WHERE slug = ?", [slug]);
  if (result.affectedRows === 0) throw Object.assign(new Error("Project not found."), { status: 404 });
}