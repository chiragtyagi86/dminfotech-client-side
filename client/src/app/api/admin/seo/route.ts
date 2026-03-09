// app/api/admin/seo/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/admin/seo   → get global SEO settings + pages and blogs list
// PUT  /api/admin/seo   → update global SEO settings
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    // Get global SEO settings
    const [settingsRows] = await pool.query<any[]>(
      "SELECT setting_key, setting_value FROM seo_settings ORDER BY setting_key"
    );

    const global: any = {};
    (settingsRows as any[]).forEach((row) => {
      const key = row.setting_key;
      if (key === "default_meta_title") global.defaultMetaTitle = row.setting_value;
      if (key === "default_meta_description") global.defaultMetaDescription = row.setting_value;
      if (key === "default_og_image") global.defaultOgImage = row.setting_value;
      if (key === "canonical_domain") global.canonicalDomain = row.setting_value;
      if (key === "site_keywords") global.siteKeywords = row.setting_value;
    });

    // Get pages with SEO data
    const [pagesRows] = await pool.query<any[]>(
      `SELECT p.id, p.title, p.slug,
              COALESCE(ps.meta_title, '') as meta_title,
              COALESCE(ps.meta_description, '') as meta_description,
              COALESCE(ps.canonical_url, '') as canonical_url,
              COALESCE(ps.og_title, '') as og_title,
              COALESCE(ps.og_description, '') as og_description,
              COALESCE(ps.og_image, '') as og_image,
              COALESCE(ps.index_enabled, true) as index_enabled,
              COALESCE(ps.keywords, '') as keywords
       FROM pages p
       LEFT JOIN page_seo ps ON p.id = ps.page_id
       ORDER BY p.title`
    );

    const pages = (pagesRows as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      seo: {
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        canonicalUrl: row.canonical_url,
        ogTitle: row.og_title,
        ogDescription: row.og_description,
        ogImage: row.og_image,
        indexEnabled: row.index_enabled,
        keywords: row.keywords,
      },
    }));

    // Get blog posts with SEO data
    const [blogsRows] = await pool.query<any[]>(
      `SELECT b.id, b.title, b.slug,
              COALESCE(bs.meta_title, '') as meta_title,
              COALESCE(bs.meta_description, '') as meta_description,
              COALESCE(bs.canonical_url, '') as canonical_url,
              COALESCE(bs.og_title, '') as og_title,
              COALESCE(bs.og_description, '') as og_description,
              COALESCE(bs.og_image, '') as og_image,
              COALESCE(bs.index_enabled, true) as index_enabled,
              COALESCE(bs.keywords, '') as keywords
       FROM blog_posts b
       LEFT JOIN blog_seo bs ON b.id = bs.blog_id
       ORDER BY b.title`
    );

    const blogs = (blogsRows as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      seo: {
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        canonicalUrl: row.canonical_url,
        ogTitle: row.og_title,
        ogDescription: row.og_description,
        ogImage: row.og_image,
        indexEnabled: row.index_enabled,
        keywords: row.keywords,
      },
    }));

    return NextResponse.json({
      global,
      pages,
      blogs,
    });
  } catch (err) {
    console.error("[seo/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const {
      defaultMetaTitle,
      defaultMetaDescription,
      defaultOgImage,
      canonicalDomain,
      siteKeywords,
    } = body;

    // Update global settings
    const updates = [
      { key: "default_meta_title", value: defaultMetaTitle },
      { key: "default_meta_description", value: defaultMetaDescription },
      { key: "default_og_image", value: defaultOgImage },
      { key: "canonical_domain", value: canonicalDomain },
      { key: "site_keywords", value: siteKeywords },
    ];

    for (const update of updates) {
      await pool.query(
        "UPDATE seo_settings SET setting_value = ? WHERE setting_key = ?",
        [update.value, update.key]
      );
    }

    return NextResponse.json({
      message: "Global SEO settings updated successfully",
    });
  } catch (err) {
    console.error("[seo/PUT]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}