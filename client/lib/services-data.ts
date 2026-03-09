// lib/services-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All services data helpers — connected to dhanamitra_cms `services` table.
// ─────────────────────────────────────────────────────────────────────────────

import db from "./db";
import type { ServiceItem } from "./types";

/**
 * Get all published services ordered by sort_order.
 */
export async function getAllServices(): Promise<ServiceItem[]> {
  const [rows] = await db.query(
    `SELECT id, title, slug, short_desc, content, icon, image,
            sort_order, status, meta_title, meta_description
     FROM services
     WHERE status = 'published'
     ORDER BY sort_order ASC`
  );
  return rows as ServiceItem[];
}

/**
 * Get a single service by slug.
 */
export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const [rows] = await db.query(
    `SELECT id, title, slug, short_desc, content, icon, image,
            sort_order, status, meta_title, meta_description
     FROM services
     WHERE slug = ? AND status = 'published'
     LIMIT 1`,
    [slug]
  );
  const row = (rows as any[])[0];
  return row ?? null;
}

/**
 * Get all published slugs for generateStaticParams.
 */
export async function getAllServiceSlugs(): Promise<string[]> {
  const [rows] = await db.query(
    `SELECT slug FROM services WHERE status = 'published'`
  );
  return (rows as any[]).map((r) => r.slug);
}