// lib/portfolio-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// All portfolio data helpers — connected to dhanamitra_cms `portfolio_items`.
// ─────────────────────────────────────────────────────────────────────────────

import db from "./db";

export type PortfolioItem = {
  id:               number;
  title:            string;
  slug:             string;
  category:         string;
  short_desc:       string;
  content:          string | null;  // JSON: { industry, accent, year, featured, projectLink, ... }
  image:            string | null;
  gallery:          string | null;
  client:           string | null;
  project_url:      string | null;
  sort_order:       number;
  status:           string;
  meta_title:       string | null;
  meta_description: string | null;
};

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  const [rows] = await db.query(
    `SELECT id, title, slug, category, short_desc, content, image, gallery,
            client, project_url, sort_order, status, meta_title, meta_description
     FROM portfolio_items
     WHERE status = 'published'
     ORDER BY sort_order ASC`
  );
  return rows as PortfolioItem[];
}

export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
  const [rows] = await db.query(
    `SELECT id, title, slug, category, short_desc, content, image, gallery,
            client, project_url, sort_order, status, meta_title, meta_description
     FROM portfolio_items
     WHERE slug = ? AND status = 'published'
     LIMIT 1`,
    [slug]
  );
  const row = (rows as any[])[0];
  return row ?? null;
}

export async function getAllPortfolioSlugs(): Promise<string[]> {
  const [rows] = await db.query(
    `SELECT slug FROM portfolio_items WHERE status = 'published'`
  );
  return (rows as any[]).map((r) => r.slug);
}

export type CaseStudyItem = {
  title:    string;
  industry: string;
  problem:  string;
  solution: string;
  results:  { metric: string; label: string }[];
};

/**
 * Get the first published item with caseStudyEnabled = true in content JSON.
 * Falls back to the first featured item if none explicitly enabled.
 */
export async function getFeaturedCaseStudy(): Promise<CaseStudyItem | null> {
  const [rows] = await db.query(
    `SELECT title, content
     FROM portfolio_items
     WHERE status = 'published'
     ORDER BY sort_order ASC`
  );

  const all = rows as { title: string; content: string }[];

  // prefer caseStudyEnabled: true, then featured: true
  let picked = all.find((r) => {
    try { return JSON.parse(r.content)?.caseStudyEnabled === true; } catch { return false; }
  }) ?? all.find((r) => {
    try { return JSON.parse(r.content)?.featured === true; } catch { return false; }
  }) ?? all[0] ?? null;

  if (!picked) return null;

  let c: any = {};
  try { c = JSON.parse(picked.content); } catch {}

  return {
    title:    picked.title,
    industry: c.industry || "",
    problem:  c.problem  || "",
    solution: c.solution || "",
    results:  Array.isArray(c.results)
                ? c.results.filter((r: any) => r.metric || r.label)
                : [],
  };
}