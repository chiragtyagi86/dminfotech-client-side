// lib/blog-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All blog data helpers — fully connected to dhanamitra_cms MySQL database.
// Drop-in replacement for the old static blog-data array.
// ─────────────────────────────────────────────────────────────────────────────

import db from "./db";

// ── Types ─────────────────────────────────────────────────────────────────────

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order_index: number;
  is_active: boolean;
};

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
  // Joined / computed
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

/** Format a MySQL datetime string into a readable date */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Estimate reading time from content word count */
function calcReadTime(content: string): number {
  const words = (content ?? "").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Map a raw DB row → BlogPost shape */
function formatPost(row: any): BlogPost {
  return {
    id:               row.id,
    title:            row.title         ?? "",
    slug:             row.slug          ?? "",
    excerpt:          row.excerpt       ?? "",
    content:          row.content       ?? "",
    cover_image:      row.cover_image   ?? "",
    status:           row.status,
    published_at:     row.published_at  ?? "",
    meta_title:       row.meta_title    ?? row.title ?? "",
    meta_description: row.meta_description ?? row.excerpt ?? "",
    og_image:         row.og_image      ?? "",
    created_at:       row.created_at    ?? "",
    updated_at:       row.updated_at    ?? "",
    // Joined fields
    category:         row.category_name  ?? "General",
    category_slug:    row.category_slug  ?? "general",
    category_color:   row.category_color ?? "#3a405a",
    category_icon:    row.category_icon  ?? "📝",
    // Computed
    readTime:   calcReadTime(row.content),
    tags:       row.tags ? (row.tags as string).split(",").map((t: string) => t.trim()) : [],
    coverAccent: row.category_color
      ? `${row.category_color}33`         // hex + 20% alpha
      : "rgba(153,178,221,0.20)",
    author: {
      name: row.author_name ?? "Dhanamitra Team",
      role: row.author_role ?? "Editorial",
    },
  };
}

// ── Base SELECT — reused in all queries ───────────────────────────────────────
// NOTE: Your DB does not have a blog_post_categories pivot table.
// Categories are linked via blog_posts.category_id directly.
// If your blog_posts table doesn't have category_id yet, run this migration:
//   ALTER TABLE blog_posts ADD COLUMN category_id INT DEFAULT NULL;
//   ALTER TABLE blog_posts ADD FOREIGN KEY (category_id) REFERENCES blog_categories(id);

const BASE_SELECT = `
  SELECT
    bp.*,
    bc.name  AS category_name,
    bc.slug  AS category_slug,
    bc.color AS category_color,
    bc.icon  AS category_icon
  FROM blog_posts bp
  LEFT JOIN blog_categories bc ON bc.id = bp.category_id
`;

// ── Data functions ─────────────────────────────────────────────────────────────

/**
 * Get all published blog posts — used on /blog listing page.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const [rows] = await db.query(
    `${BASE_SELECT}
     WHERE bp.status = 'published'
     ORDER BY bp.published_at DESC`
  );
  return (rows as any[]).map(formatPost);
}

/**
 * Get a single published post by slug — used on /blog/[slug] page.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const [rows] = await db.query(
    `${BASE_SELECT}
     WHERE bp.slug = ? AND bp.status = 'published'
     LIMIT 1`,
    [slug]
  );
  const post = (rows as any[])[0];
  return post ? formatPost(post) : null;
}

/**
 * Get related posts — same category, excluding current slug.
 * Falls back to latest posts if no category match.
 */
export async function getRelatedPosts(current: BlogPost): Promise<BlogPost[]> {
  const [rows] = await db.query(
    `${BASE_SELECT}
     WHERE bp.slug != ?
       AND bp.status = 'published'
       AND bc.slug = ?
     ORDER BY bp.published_at DESC
     LIMIT 3`,
    [current.slug, current.category_slug]
  );

  // Fallback: just get latest posts if no related found
  if ((rows as any[]).length === 0) {
    const [fallback] = await db.query(
      `${BASE_SELECT}
       WHERE bp.slug != ? AND bp.status = 'published'
       ORDER BY bp.published_at DESC
       LIMIT 3`,
      [current.slug]
    );
    return (fallback as any[]).map(formatPost);
  }

  return (rows as any[]).map(formatPost);
}

/**
 * Get posts filtered by category slug.
 */
export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const [rows] = await db.query(
    `${BASE_SELECT}
     WHERE bp.status = 'published'
       AND bc.slug = ?
     ORDER BY bp.published_at DESC`,
    [categorySlug]
  );
  return (rows as any[]).map(formatPost);
}

/**
 * Get all active blog categories — used in sidebar / filter.
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
  const [rows] = await db.query(
    `SELECT * FROM blog_categories
     WHERE is_active = 1
     ORDER BY order_index ASC`
  );
  return rows as BlogCategory[];
}

/**
 * Get all published slugs — used in generateStaticParams.
 */
export async function getAllSlugs(): Promise<string[]> {
  const [rows] = await db.query(
    `SELECT slug FROM blog_posts WHERE status = 'published'`
  );
  return (rows as any[]).map((r) => r.slug);
}

/**
 * Get post count per category — used in sidebar.
 */
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