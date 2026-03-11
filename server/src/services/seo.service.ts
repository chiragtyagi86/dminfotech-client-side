// src/services/seo.service.ts

import db from "../config/db";
import path from "path";
import fs from "fs/promises";

// ── SEO ───────────────────────────────────────────────────────────────────────

export async function getAdminSeo() {
  const [settingsRows] = await db.query<any[]>(
    "SELECT setting_key, setting_value FROM seo_settings ORDER BY setting_key"
  );

  const global: any = {};
  (settingsRows as any[]).forEach((row) => {
    if (row.setting_key === "default_meta_title")       global.defaultMetaTitle       = row.setting_value;
    if (row.setting_key === "default_meta_description") global.defaultMetaDescription = row.setting_value;
    if (row.setting_key === "default_og_image")         global.defaultOgImage         = row.setting_value;
    if (row.setting_key === "canonical_domain")         global.canonicalDomain        = row.setting_value;
    if (row.setting_key === "site_keywords")            global.siteKeywords           = row.setting_value;
  });

  const [pagesRows] = await db.query<any[]>(
    `SELECT p.id, p.title, p.slug,
            COALESCE(ps.meta_title,'') as meta_title, COALESCE(ps.meta_description,'') as meta_description,
            COALESCE(ps.canonical_url,'') as canonical_url, COALESCE(ps.og_title,'') as og_title,
            COALESCE(ps.og_description,'') as og_description, COALESCE(ps.og_image,'') as og_image,
            COALESCE(ps.index_enabled,true) as index_enabled, COALESCE(ps.keywords,'') as keywords
     FROM pages p LEFT JOIN page_seo ps ON p.id = ps.page_id ORDER BY p.title`
  );

  const [blogsRows] = await db.query<any[]>(
    `SELECT b.id, b.title, b.slug,
            COALESCE(bs.meta_title,'') as meta_title, COALESCE(bs.meta_description,'') as meta_description,
            COALESCE(bs.canonical_url,'') as canonical_url, COALESCE(bs.og_title,'') as og_title,
            COALESCE(bs.og_description,'') as og_description, COALESCE(bs.og_image,'') as og_image,
            COALESCE(bs.index_enabled,true) as index_enabled, COALESCE(bs.keywords,'') as keywords
     FROM blog_posts b LEFT JOIN blog_seo bs ON b.id = bs.blog_id ORDER BY b.title`
  );

  const mapSeo = (row: any) => ({
    id: row.id, title: row.title, slug: row.slug,
    seo: { metaTitle: row.meta_title, metaDescription: row.meta_description,
           canonicalUrl: row.canonical_url, ogTitle: row.og_title, ogDescription: row.og_description,
           ogImage: row.og_image, indexEnabled: row.index_enabled, keywords: row.keywords },
  });

  return { global, pages: (pagesRows as any[]).map(mapSeo), blogs: (blogsRows as any[]).map(mapSeo) };
}

export async function updateGlobalSeo(body: any): Promise<void> {
  const updates = [
    { key: "default_meta_title",       value: body.defaultMetaTitle       },
    { key: "default_meta_description", value: body.defaultMetaDescription },
    { key: "default_og_image",         value: body.defaultOgImage         },
    { key: "canonical_domain",         value: body.canonicalDomain        },
    { key: "site_keywords",            value: body.siteKeywords           },
  ];
  for (const u of updates) {
    await db.query("UPDATE seo_settings SET setting_value = ? WHERE setting_key = ?", [u.value, u.key]);
  }
}

export async function updateEntitySeo(type: string, id: string, body: any): Promise<void> {
  if (!["page", "blog"].includes(type))
    throw Object.assign(new Error("Invalid type. Must be 'page' or 'blog'."), { status: 400 });

  const table      = type === "page" ? "page_seo"    : "blog_seo";
  const idColumn   = type === "page" ? "page_id"     : "blog_id";
  const dataTable  = type === "page" ? "pages"        : "blog_posts";

  const [existing] = await db.query<any[]>(`SELECT id FROM ${dataTable} WHERE id = ?`, [id]);
  if (existing.length === 0) throw Object.assign(new Error("Not found"), { status: 404 });

  const { metaTitle, metaDescription, canonicalUrl, ogTitle, ogDescription, ogImage, indexEnabled, keywords } = body;
  const vals = [metaTitle || null, metaDescription || null, canonicalUrl || null,
                ogTitle || null, ogDescription || null, ogImage || null,
                indexEnabled !== false, keywords || null];

  const [seoCheck] = await db.query<any[]>(`SELECT id FROM ${table} WHERE ${idColumn} = ?`, [id]);
  if (seoCheck.length === 0) {
    await db.query(
      `INSERT INTO ${table} (${idColumn}, meta_title, meta_description, canonical_url, og_title, og_description, og_image, index_enabled, keywords)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, ...vals]
    );
  } else {
    await db.query(
      `UPDATE ${table} SET meta_title=?, meta_description=?, canonical_url=?, og_title=?,
                           og_description=?, og_image=?, index_enabled=?, keywords=?, updated_at=NOW()
       WHERE ${idColumn}=?`,
      [...vals, id]
    );
  }
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getAdminSettings() {
  const [settingsRows] = await db.query<any[]>(
    "SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key"
  );

  const settings: any = {};
  const keyMap: Record<string,string> = {
    site_name: "siteName", site_tagline: "siteTagline", company_description: "companyDescription",
    email: "email", phone: "phone", whatsapp: "whatsapp", address: "address",
    facebook_url: "facebookUrl", linkedin_url: "linkedinUrl", instagram_url: "instagramUrl",
    twitter_url: "twitterUrl", youtube_url: "youtubeUrl",
    copyright_text: "copyrightText", footer_description: "footerDescription",
  };
  (settingsRows as any[]).forEach((row) => {
    const key = keyMap[row.setting_key];
    if (key) settings[key] = row.setting_value;
  });

  const [mediaRows] = await db.query<any[]>("SELECT media_key, file_path, media_type FROM site_media");
  const media: any = { logo: null, favicon: null, defaultSocialImage: null };
  (mediaRows as any[]).forEach((row) => {
    if (row.media_key === "logo")                 media.logo               = { filePath: row.file_path, type: row.media_type };
    if (row.media_key === "favicon")              media.favicon            = { filePath: row.file_path, type: row.media_type };
    if (row.media_key === "default_social_image") media.defaultSocialImage = { filePath: row.file_path, type: row.media_type };
  });

  return { settings, media };
}

export async function updateAdminSettings(body: any): Promise<void> {
  const updates = [
    { key: "site_name",            value: body.siteName             },
    { key: "site_tagline",         value: body.siteTagline          },
    { key: "company_description",  value: body.companyDescription   },
    { key: "email",                value: body.email                },
    { key: "phone",                value: body.phone                },
    { key: "whatsapp",             value: body.whatsapp             },
    { key: "address",              value: body.address              },
    { key: "facebook_url",         value: body.facebookUrl          },
    { key: "linkedin_url",         value: body.linkedinUrl          },
    { key: "instagram_url",        value: body.instagramUrl         },
    { key: "twitter_url",          value: body.twitterUrl           },
    { key: "youtube_url",          value: body.youtubeUrl           },
    { key: "copyright_text",       value: body.copyrightText        },
    { key: "footer_description",   value: body.footerDescription    },
  ];
  for (const u of updates) {
    await db.query("UPDATE site_settings SET setting_value = ? WHERE setting_key = ?", [u.value || "", u.key]);
  }
}

function generateMediaKey() {
  return `media_${Date.now()}`;
}

export async function uploadMedia(mediaKey: string | null | undefined, file: Express.Multer.File): Promise<string> {
  // If no mediaKey provided (e.g. called from blog/general upload), generate one
  const key = mediaKey?.trim() ? mediaKey.trim() : generateMediaKey();

  const mediaType =
    key === "logo"    ? "logo"    :
    key === "favicon" ? "favicon" : "social_image";

  const publicPath = `./uploads/settings/${file.filename}`;

  await db.query(
    `INSERT INTO site_media (media_key, file_name, file_path, file_type, file_size, media_type)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE file_name=VALUES(file_name), file_path=VALUES(file_path),
                             file_type=VALUES(file_type), file_size=VALUES(file_size), updated_at=NOW()`,
    [key, file.filename, publicPath, file.mimetype, file.size, mediaType]
  );

  return publicPath;
}

export async function deleteMedia(key: string): Promise<void> {
  const [rows] = await db.query<any[]>("SELECT file_path FROM site_media WHERE media_key = ?", [key]);
  if (rows.length === 0) throw Object.assign(new Error("Media not found"), { status: 404 });

  const fullPath = path.join(process.cwd(), "public", rows[0].file_path);
  try { await fs.unlink(fullPath); } catch { /* file may not exist on disk */ }

  await db.query("DELETE FROM site_media WHERE media_key = ?", [key]);
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const run = async (sql: string) => {
    const [rows] = await db.query<any[]>(sql);
    return (rows as any[])[0]?.count || 0;
  };

  const [pages, blogPosts, draftPosts, leads, newLeads, teamMembers] = await Promise.all([
    run("SELECT COUNT(*) as count FROM pages"),
    run("SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'"),
    run("SELECT COUNT(*) as count FROM blog_posts WHERE status = 'draft'"),
    run("SELECT COUNT(*) as count FROM leads"),
    run("SELECT COUNT(*) as count FROM leads WHERE status = 'new'"),
    run("SELECT COUNT(*) as count FROM team_members WHERE is_active = true"),
  ]);

  return { pages, blogPosts, draftPosts, leads, newLeads, teamMembers };
}