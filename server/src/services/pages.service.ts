// src/services/pages.service.ts

import db from "../config/db";

const CORE_PAGES = ["home", "about", "contact"];

export async function getAdminPages(page: number, limit: number, search: string) {
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const params: unknown[]    = [];

  if (search) {
    conditions.push("(slug LIKE ? OR title LIKE ? OR description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countRows] = await db.query<any[]>(`SELECT COUNT(*) AS total FROM pages ${where}`, params);
  const total = (countRows as any[])[0].total;

  const [rows] = await db.query<any[]>(
    `SELECT id, slug, title, description, is_published, updated_at
     FROM pages ${where} ORDER BY slug ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    data: (rows as any[]).map((p) => ({
      id: p.id, key: p.slug, slug: p.slug, title: p.title,
      description: p.description, href: `/admin/pages/${p.slug}`,
      isPublished: p.is_published, updatedAt: p.updated_at,
    })),
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  };
}

export async function getPageBySlug(slug: string) {
  const [rows] = await db.query<any[]>(
    `SELECT id, slug, title, description, content, is_published FROM pages WHERE slug = ?`, [slug]
  );
  if (rows.length === 0) throw Object.assign(new Error("Page not found"), { status: 404 });

  const p = rows[0];
  const content = typeof p.content === "string" ? JSON.parse(p.content) : p.content;
  return { id: p.id, slug: p.slug, title: p.title, description: p.description, content, isPublished: p.is_published };
}

export async function createPage(body: any): Promise<{ slug: string }> {
  const { slug, title, description, content } = body;
  if (!slug || !title) throw Object.assign(new Error("slug and title are required"), { status: 400 });

  const [existing] = await db.query<any[]>("SELECT id FROM pages WHERE slug = ?", [slug]);
  if (existing.length > 0) throw Object.assign(new Error("Page with this slug already exists"), { status: 409 });

  await db.query(
    "INSERT INTO pages (slug, title, description, content, is_published) VALUES (?, ?, ?, ?, true)",
    [slug, title, description || "", JSON.stringify(content || {})]
  );
  return { slug };
}

export async function updatePage(slug: string, body: any): Promise<void> {
  const { content, title, description } = body;

  const [existing] = await db.query<any[]>("SELECT id FROM pages WHERE slug = ?", [slug]);
  if (existing.length === 0) throw Object.assign(new Error("Page not found"), { status: 404 });

  await db.query(
    "UPDATE pages SET content=?, title=?, description=?, updated_at=NOW() WHERE slug=?",
    [JSON.stringify(content), title, description, slug]
  );
}

export async function deletePage(slug: string): Promise<void> {
  if (CORE_PAGES.includes(slug))
    throw Object.assign(new Error("Cannot delete core pages (home, about, contact)"), { status: 403 });
  await db.query("DELETE FROM pages WHERE slug = ?", [slug]);
}