// lib/seo-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// Reads SEO data from the actual DB schema:
//   seo_settings  — key/value rows (setting_key, setting_value)
//   page_seo      — one row per page  (page_id FK → pages.id)
//   blog_seo      — one row per post  (blog_id  FK → blog_posts.id)
// ─────────────────────────────────────────────────────────────────────────────

import db from "./db";
import type { Metadata } from "next";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SeoRow {
  meta_title:       string | null;
  meta_description: string | null;
  og_title:         string | null;
  og_description:   string | null;
  og_image:         string | null;
  canonical_url:    string | null;
  index_enabled:    boolean;
  keywords:         string | null;
}

export interface GlobalSeo {
  defaultMetaTitle:       string;
  defaultMetaDescription: string;
  defaultOgImage:         string;
  canonicalDomain:        string;
  siteKeywords:           string;
}

const EMPTY_GLOBAL: GlobalSeo = {
  defaultMetaTitle:       "",
  defaultMetaDescription: "",
  defaultOgImage:         "",
  canonicalDomain:        "https://dhanamitra.com",
  siteKeywords:           "",
};

// ── Global defaults  (seo_settings key/value table) ───────────────────────────

export async function getGlobalSeo(): Promise<GlobalSeo> {
  try {
    const [rows] = await db.query<any[]>(
      "SELECT setting_key, setting_value FROM seo_settings"
    );
    const map: Record<string, string> = {};
    (rows as any[]).forEach((r) => { map[r.setting_key] = r.setting_value ?? ""; });
    return {
      defaultMetaTitle:       map["default_meta_title"]       ?? "",
      defaultMetaDescription: map["default_meta_description"] ?? "",
      defaultOgImage:         map["default_og_image"]         ?? "",
      canonicalDomain:        map["canonical_domain"]         ?? "https://dhanamitra.com",
      siteKeywords:           map["site_keywords"]            ?? "",
    };
  } catch {
    return EMPTY_GLOBAL;
  }
}

// ── Page SEO  (page_seo JOIN pages on slug) ───────────────────────────────────

export async function getPageSeo(slug: string): Promise<SeoRow | null> {
  try {
    const [rows] = await db.query<any[]>(
      `SELECT s.meta_title, s.meta_description, s.og_title, s.og_description,
              s.og_image, s.canonical_url, s.index_enabled, s.keywords
       FROM page_seo s
       JOIN pages p ON p.id = s.page_id
       WHERE p.slug = ?
       LIMIT 1`,
      [slug]
    );
    return (rows as SeoRow[])[0] ?? null;
  } catch {
    return null;
  }
}

// ── Blog post SEO  (blog_seo JOIN blog_posts on slug) ─────────────────────────

export async function getBlogPostSeo(slug: string): Promise<SeoRow | null> {
  try {
    const [rows] = await db.query<any[]>(
      `SELECT s.meta_title, s.meta_description, s.og_title, s.og_description,
              s.og_image, s.canonical_url, s.index_enabled, s.keywords
       FROM blog_seo s
       JOIN blog_posts b ON b.id = s.blog_id
       WHERE b.slug = ?
       LIMIT 1`,
      [slug]
    );
    return (rows as SeoRow[])[0] ?? null;
  } catch {
    return null;
  }
}

// ── Service SEO  (meta_title/meta_description already on services table) ───────

export async function getServiceSeo(slug: string): Promise<SeoRow | null> {
  try {
    const [rows] = await db.query<any[]>(
      `SELECT meta_title, meta_description,
              NULL AS og_title,      NULL AS og_description,
              NULL AS og_image,      NULL AS canonical_url,
              1    AS index_enabled, NULL AS keywords
       FROM services WHERE slug = ? LIMIT 1`,
      [slug]
    );
    return (rows as SeoRow[])[0] ?? null;
  } catch {
    return null;
  }
}

// ── Portfolio SEO  (meta_title/meta_description already on portfolio_items) ────

export async function getPortfolioSeo(slug: string): Promise<SeoRow | null> {
  try {
    const [rows] = await db.query<any[]>(
      `SELECT meta_title, meta_description,
              NULL AS og_title,      NULL AS og_description,
              NULL AS og_image,      NULL AS canonical_url,
              1    AS index_enabled, NULL AS keywords
       FROM portfolio_items WHERE slug = ? LIMIT 1`,
      [slug]
    );
    return (rows as SeoRow[])[0] ?? null;
  } catch {
    return null;
  }
}

// ── buildMetadata  (call inside every generateMetadata) ───────────────────────
//
// Priority:  page SEO row  →  global defaults  →  hardcoded fallback
//
// Example:
//   export async function generateMetadata({ params }) {
//     const { slug } = await params;
//     const [seo, global] = await Promise.all([getBlogPostSeo(slug), getGlobalSeo()]);
//     return buildMetadata({ seo, global, fallbackTitle: post.title, canonicalPath: `/blog/${slug}` });
//   }

export function buildMetadata({
  seo,
  global,
  fallbackTitle,
  fallbackDescription = "",
  fallbackImage,
  canonicalPath,
  type = "website",
  publishedTime,
}: {
  seo:                 SeoRow | null;
  global?:             GlobalSeo | null;
  fallbackTitle:       string;
  fallbackDescription?: string;
  fallbackImage?:       string;
  canonicalPath?:       string;     // e.g. "/blog/my-post"
  type?:               "website" | "article";
  publishedTime?:       string;
}): Metadata {
  const siteName    = "Dhanamitra Infotech LLP";
  const domain      = (global?.canonicalDomain ?? "https://dhanamitra.com").replace(/\/$/, "");

  const title       = seo?.meta_title       || global?.defaultMetaTitle       || fallbackTitle;
  const description = seo?.meta_description || global?.defaultMetaDescription || fallbackDescription;
  const ogTitle     = seo?.og_title         || title;
  const ogDesc      = seo?.og_description   || description;
  const ogImage     = seo?.og_image         || global?.defaultOgImage          || fallbackImage;
  const canonical   = seo?.canonical_url    || (canonicalPath ? `${domain}${canonicalPath}` : undefined);
  const noIndex     = seo?.index_enabled === false;
  const keywords    = seo?.keywords         || global?.siteKeywords            || undefined;

  return {
    title:       `${title} | ${siteName}`,
    description,
    ...(keywords  ? { keywords }                                  : {}),
    ...(canonical ? { alternates: { canonical } }                 : {}),
    ...(noIndex   ? { robots: { index: false, follow: false } }   : {}),
    openGraph: {
      title:       ogTitle,
      description: ogDesc,
      siteName,
      type,
      ...(publishedTime ? { publishedTime }                       : {}),
      ...(ogImage       ? { images: [{ url: ogImage }] }          : {}),
    },
  };
}