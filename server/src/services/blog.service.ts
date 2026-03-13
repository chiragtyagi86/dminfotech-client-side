// src/services/blog.service.ts

import db from "../config/db";
import { slugify } from "../utils/slugify";

// ── Types ─────────────────────────────────────────────────────────────────────

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  status: "draft" | "published";
  published_at: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
  created_at: string;
  updated_at: string;
  category: string;
  category_slug: string;
  category_color: string;
  category_icon: string;
  readTime: number;
  tags: string[];
  coverAccent: string;
  author: { name: string; role: string };
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcReadTime(content: string): number {
  const words = (content ?? "").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title ?? "",
    slug: row.slug ?? "",
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    cover_image: row.cover_image ?? "",
    status: row.status,
    published_at: row.published_at ?? "",
    meta_title: row.meta_title ?? row.title ?? "",
    meta_description: row.meta_description ?? row.excerpt ?? "",
    og_image: row.og_image ?? "",
    created_at: row.created_at ?? "",
    updated_at: row.updated_at ?? "",
    category: row.category_name ?? "General",
    category_slug: row.category_slug ?? "general",
    category_color: row.category_color ?? "#3a405a",
    category_icon: row.category_icon ?? "📝",
    readTime: calcReadTime(row.content),
    tags: row.tags ? (row.tags as string).split(",").map((t: string) => t.trim()) : [],
    coverAccent: row.category_color ? `${row.category_color}33` : "rgba(153,178,221,0.20)",
    author: {
      name: row.author_name ?? "Dhanamitra Team",
      role: row.author_role ?? "Editorial",
    },
  };
}

const BASE_SELECT = `
  SELECT bp.*, bc.name AS category_name, bc.slug AS category_slug,
         bc.color AS category_color, bc.icon AS category_icon
  FROM blog_posts bp
  LEFT JOIN blog_categories bc ON bc.id = bp.category_id
`;

// ── Public queries ────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<BlogPost[]> {
  const [rows] = await db.query(
    `${BASE_SELECT} WHERE bp.status = 'published' ORDER BY bp.published_at DESC`
  );
  return (rows as any[]).map(formatPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const [rows] = await db.query(
    `${BASE_SELECT} WHERE bp.slug = ? AND bp.status = 'published' LIMIT 1`, [slug]
  );
  const post = (rows as any[])[0];
  return post ? formatPost(post) : null;
}

export async function getRelatedPosts(current: BlogPost): Promise<BlogPost[]> {
  const [rows] = await db.query(
    `${BASE_SELECT}
     WHERE bp.slug != ? AND bp.status = 'published' AND bc.slug = ?
     ORDER BY bp.published_at DESC LIMIT 3`,
    [current.slug, current.category_slug]
  );
  if ((rows as any[]).length === 0) {
    const [fallback] = await db.query(
      `${BASE_SELECT}
       WHERE bp.slug != ? AND bp.status = 'published'
       ORDER BY bp.published_at DESC LIMIT 3`,
      [current.slug]
    );
    return (fallback as any[]).map(formatPost);
  }
  return (rows as any[]).map(formatPost);
}

export async function getAllCategories() {
  const [rows] = await db.query(
    `SELECT * FROM blog_categories WHERE is_active = 1 ORDER BY order_index ASC`
  );
  return rows;
}

export async function getCategoryPostCounts(): Promise<Record<string, number>> {
  const [rows] = await db.query(
    `SELECT bc.slug, COUNT(bp.id) as count
     FROM blog_categories bc
     LEFT JOIN blog_posts bp ON bp.category_id = bc.id AND bp.status = 'published'
     WHERE bc.is_active = 1
     GROUP BY bc.id, bc.slug`
  );
  const counts: Record<string, number> = {};
  (rows as any[]).forEach((r) => { counts[r.slug] = Number(r.count); });
  return counts;
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export async function getAdminPosts(
  page: number, limit: number, search: string, status: string
) {
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (search) { conditions.push("(title LIKE ? OR excerpt LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }
  if (status) { conditions.push("status = ?"); params.push(status); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countRows] = await db.query<any[]>(`SELECT COUNT(*) AS total FROM blog_posts ${where}`, params);
  const total = (countRows as any[])[0].total;

  const [rows] = await db.query<any[]>(
    `SELECT id, title, slug, excerpt, cover_image, status, published_at,
            meta_title, meta_description, created_at, updated_at, category_id
     FROM blog_posts ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
}

export async function getAdminPostBySlug(slug: string) {
  const [rows] = await db.query<any[]>("SELECT * FROM blog_posts WHERE slug = ?", [slug]);
  if (!(rows as any[]).length) return null;
  const post = (rows as any[])[0];
  return { ...post, featuredImage: post.cover_image, seoTitle: post.meta_title, seoDescription: post.meta_description, ogImage: post.og_image };
}

export async function createPost(body: any): Promise<{ id: number; slug: string }> {
  const title = body.title || "";
  const excerpt = body.excerpt || "";
  const content = body.content || "";
  const status = body.status || "draft";
  const cover_image = body.featuredImage || body.cover_image || "";
  const category_id = body.category_id || null;
  const meta_title = body.seoTitle || body.meta_title || "";
  const meta_description = body.seoDescription || body.meta_description || "";
  const og_image = body.ogImage || body.og_image || "";

  if (!title.trim()) throw Object.assign(new Error("Title is required."), { status: 400 });

  let slug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
  const [existing] = await db.query<any[]>("SELECT id FROM blog_posts WHERE slug = ?", [slug]);
  if ((existing as any[]).length) slug = `${slug}-${Date.now()}`;

  const published_at = status === "published"
    ? (body.publishDate ? new Date(body.publishDate) : new Date())
    : null;

  const [result] = await db.query<any>(
    `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, status, published_at,
                             meta_title, meta_description, og_image, category_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title.trim(), slug, excerpt, content, cover_image, status, published_at, meta_title, meta_description, og_image]
  );

  return { id: result.insertId, slug };
}

export async function updatePost(slug: string, body: any): Promise<{ slug: string }> {
  const [existing] = await db.query<any[]>("SELECT id, status FROM blog_posts WHERE slug = ?", [slug]);
  if (!(existing as any[]).length) throw Object.assign(new Error("Post not found."), { status: 404 });

  const post = (existing as any[])[0];
  const title = body.title || "";
  const excerpt = body.excerpt ?? "";
  const content = body.content ?? "";
  const status = body.status || post.status;
  const category_id = body.category_id || post.category_id                  ;
  const cover_image = body.featuredImage || body.cover_image || "";
  const meta_title = body.seoTitle || body.meta_title || "";
  const meta_description = body.seoDescription || body.meta_description || "";
  const og_image = body.ogImage || body.og_image || "";

  if (!title.trim()) throw Object.assign(new Error("Title is required."), { status: 400 });

  let newSlug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
  if (newSlug !== slug) {
    const [check] = await db.query<any[]>("SELECT id FROM blog_posts WHERE slug = ? AND id != ?", [newSlug, post.id]);
    if ((check as any[]).length) newSlug = `${newSlug}-${Date.now()}`;
  }

  let published_at = body.published_at ?? null;
  if (status === "published" && post.status !== "published") {
    published_at = body.publishDate ? new Date(body.publishDate) : new Date();
  }

  await db.query(
    `UPDATE blog_posts SET title=?, slug=?, excerpt=?, content=?, cover_image=?, status=?,category_id=?,
                           published_at=?, meta_title=?, meta_description=?, og_image=?
     WHERE id=?`,
    [title.trim(), newSlug, excerpt, content, cover_image, status, category_id, published_at, meta_title, meta_description, og_image, post.id]
  );

  return { slug: newSlug };
}

export async function deletePost(slug: string): Promise<void> {
  const [result] = await db.query<any>("DELETE FROM blog_posts WHERE slug = ?", [slug]);
  if (result.affectedRows === 0) throw Object.assign(new Error("Post not found."), { status: 404 });
}