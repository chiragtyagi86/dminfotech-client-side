// lib/site.server.ts
// ─────────────────────────────────────────────────────────────────────────────
// SERVER ONLY — imports pool/db. Never import this in client components.
// Use in: API routes, Server Components, generateMetadata, page.tsx (async).
// ─────────────────────────────────────────────────────────────────────────────

import pool from "./db";
import { siteConfig, type SiteConfig } from "./site";

const DB_KEY_MAP: Record<string, keyof SiteConfig> = {
  site_name:            "name",
  site_tagline:         "siteTagline",
  company_description:  "description",
  email:                "contactEmail",
  phone:                "phone",
  whatsapp:             "whatsapp",
  address:              "address",
  facebook_url:         "facebookUrl",
  linkedin_url:         "linkedinUrl",
  instagram_url:        "instagramUrl",
  twitter_url:          "twitterUrl",
  youtube_url:          "youtubeUrl",
  copyright_text:       "copyrightText",
  footer_description:   "footerDescription",
};

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const [rows] = await pool.query<any[]>(
      `SELECT setting_key, setting_value FROM site_settings`
    );
    const config = { ...siteConfig };
    for (const row of rows as any[]) {
      const key = DB_KEY_MAP[row.setting_key];
      if (key && row.setting_value) (config as any)[key] = row.setting_value;
    }
    return config;
  } catch {
    return siteConfig;
  }
}