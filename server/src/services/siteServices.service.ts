// src/services/siteServices.service.ts

import db from "../config/db";
import { slugify } from "../utils/slugify";

function buildContent(body: any) {
  return JSON.stringify({
    num: body.num || "", tag: body.tag || "", tagline: body.tagline || "",
    features: body.features || "", keywords: body.keywords || "",
    accent: body.accent || "", subtitle: body.subtitle || "",
    fullDesc: body.fullDesc || "", highlights: body.highlights || [],
  });
}

function safeParseContent(raw: any) {
  try { return typeof raw === "string" ? JSON.parse(raw) : (raw || {}); }
  catch { return {}; }
}

// ── Public ────────────────────────────────────────────────────────────────────

export async function getAllServices() {
  const [rows] = await db.query(
    `SELECT id, title, slug, short_desc, content, icon, image, sort_order, status, meta_title, meta_description
     FROM services WHERE status = 'published' ORDER BY sort_order ASC`
  );
  return rows;
}

export async function getServiceBySlug(slug: string) {
  const [rows] = await db.query<any[]>(
    `SELECT * FROM services WHERE slug = ? AND status = 'published' LIMIT 1`, [slug]
  );
  return (rows as any[])[0] ?? null;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAdminServices() {
  const [rows] = await db.query<any[]>(
    `SELECT id, title, slug, short_desc, icon, image, sort_order, status,
            meta_title, meta_description, created_at, updated_at
     FROM services ORDER BY sort_order ASC, created_at ASC`
  );
  return { data: rows, meta: { total: (rows as any[]).length } };
}

export async function getAdminServiceBySlug(slug: string) {
  const [rows] = await db.query<any[]>("SELECT * FROM services WHERE slug = ?", [slug]);
  if (!(rows as any[]).length) throw Object.assign(new Error("Service not found."), { status: 404 });
  const svc = rows[0];
  const content = safeParseContent(svc.content);
  return { ...svc, ...content, desc: svc.short_desc, seoTitle: svc.meta_title, seoDescription: svc.meta_description,
           order: svc.sort_order, status: svc.status === "published" ? "active" : "inactive" };
}

export async function createService(body: any): Promise<{ id: number; slug: string }> {
  const title = body.title || "";
  if (!title.trim()) {
    throw Object.assign(new Error("Title is required."), { status: 400 });
  }

  let slug = body.slug?.trim() ? slugify(body.slug) : slugify(title);

  const [existing] = await db.query<any[]>(
    "SELECT id FROM services WHERE slug = ?",
    [slug]
  );

  if ((existing as any[]).length) {
    slug = `${slug}-${Date.now()}`;
  }

  const status =
    body.status === "published" || body.status === "active" || body.published === true
      ? "published"
      : "draft";

  let contentValue: string;
  if (typeof body.content === "string" && body.content.trim().startsWith("{")) {
    contentValue = body.content;
  } else if (typeof body.content === "object" && body.content !== null) {
    contentValue = JSON.stringify(body.content);
  } else {
    contentValue = buildContent(body);
  }

  const [result] = await db.query<any>(
    `INSERT INTO services
     (title, slug, short_desc, content, icon, image, sort_order, status, meta_title, meta_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title.trim(),
      slug,
      body.desc || body.short_desc || "",
      contentValue,
      body.icon || "",
      body.image || "",
      body.order || body.sort_order || 1,
      status,
      body.seoTitle || body.meta_title || "",
      body.seoDescription || body.meta_description || "",
    ]
  );

  return { id: result.insertId, slug };
}

export async function updateService(slug: string, body: any): Promise<{ slug: string }> {
  const [existing] = await db.query<any[]>("SELECT id FROM services WHERE slug = ?", [slug]);
  if (!(existing as any[]).length) throw Object.assign(new Error("Service not found."), { status: 404 });

  const svc = (existing as any[])[0];
  const title = body.title || "";
  if (!title.trim()) throw Object.assign(new Error("Title is required."), { status: 400 });

  let newSlug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
  if (newSlug !== slug) {
    const [check] = await db.query<any[]>("SELECT id FROM services WHERE slug = ? AND id != ?", [newSlug, svc.id]);
    if ((check as any[]).length) newSlug = `${newSlug}-${Date.now()}`;
  }

  // ── FIX 1: accept "published" directly (frontend sends "published" not "active")
  const status =
    body.status === "published" || body.status === "active" || body.published === true
      ? "published"
      : "draft";

  // ── FIX 2: if body.content is already a JSON string (sent by ServiceForm),
  //    use it directly instead of passing through buildContent which would
  //    try to read loose fields (tag, tagline etc.) that aren't on the body.
  let contentValue: string;
  if (typeof body.content === "string" && body.content.trim().startsWith("{")) {
    // already serialized by the frontend — use as-is
    contentValue = body.content;
  } else if (typeof body.content === "object" && body.content !== null) {
    // plain object — serialize it
    contentValue = JSON.stringify(body.content);
  } else {
    // fallback: build from loose fields (legacy path)
    contentValue = buildContent(body);
  }

  await db.query(
    `UPDATE services SET title=?, slug=?, short_desc=?, content=?, icon=?, image=?,
                         sort_order=?, status=?, meta_title=?, meta_description=?
     WHERE id=?`,
    [
      title.trim(),
      newSlug,
      body.short_desc || body.desc || "",
      contentValue,
      body.icon || "",
      body.image || "",
      body.sort_order || body.order || 1,
      status,
      body.meta_title || body.seoTitle || "",
      body.meta_description || body.seoDescription || "",
      svc.id,
    ]
  );

  return { slug: newSlug };
}

export async function deleteService(slug: string): Promise<void> {
  const [result] = await db.query<any>("DELETE FROM services WHERE slug = ?", [slug]);
  if (result.affectedRows === 0) throw Object.assign(new Error("Service not found."), { status: 404 });
}