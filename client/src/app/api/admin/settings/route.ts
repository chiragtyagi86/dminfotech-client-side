// app/api/admin/settings/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/admin/settings   → get all site settings and media
// PUT  /api/admin/settings   → update site settings
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    // Get all settings
    const [settingsRows] = await pool.query<any[]>(
      "SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key"
    );

    const settings: any = {};
    (settingsRows as any[]).forEach((row) => {
      const key = row.setting_key;
      if (key === "site_name") settings.siteName = row.setting_value;
      if (key === "site_tagline") settings.siteTagline = row.setting_value;
      if (key === "company_description") settings.companyDescription = row.setting_value;
      if (key === "email") settings.email = row.setting_value;
      if (key === "phone") settings.phone = row.setting_value;
      if (key === "whatsapp") settings.whatsapp = row.setting_value;
      if (key === "address") settings.address = row.setting_value;
      if (key === "facebook_url") settings.facebookUrl = row.setting_value;
      if (key === "linkedin_url") settings.linkedinUrl = row.setting_value;
      if (key === "instagram_url") settings.instagramUrl = row.setting_value;
      if (key === "twitter_url") settings.twitterUrl = row.setting_value;
      if (key === "youtube_url") settings.youtubeUrl = row.setting_value;
      if (key === "copyright_text") settings.copyrightText = row.setting_value;
      if (key === "footer_description") settings.footerDescription = row.setting_value;
    });

    // Get all media files
    const [mediaRows] = await pool.query<any[]>(
      "SELECT media_key, file_path, media_type FROM site_media"
    );

    const media: any = {
      logo: null,
      favicon: null,
      defaultSocialImage: null,
    };

    (mediaRows as any[]).forEach((row) => {
      if (row.media_key === "logo") {
        media.logo = { filePath: row.file_path, type: row.media_type };
      }
      if (row.media_key === "favicon") {
        media.favicon = { filePath: row.file_path, type: row.media_type };
      }
      if (row.media_key === "default_social_image") {
        media.defaultSocialImage = { filePath: row.file_path, type: row.media_type };
      }
    });

    return NextResponse.json({
      data: { settings, media },
    });
  } catch (err) {
    console.error("[settings/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();

    // Map from camelCase to database keys
    const updates = [
      { key: "site_name", value: body.siteName },
      { key: "site_tagline", value: body.siteTagline },
      { key: "company_description", value: body.companyDescription },
      { key: "email", value: body.email },
      { key: "phone", value: body.phone },
      { key: "whatsapp", value: body.whatsapp },
      { key: "address", value: body.address },
      { key: "facebook_url", value: body.facebookUrl },
      { key: "linkedin_url", value: body.linkedinUrl },
      { key: "instagram_url", value: body.instagramUrl },
      { key: "twitter_url", value: body.twitterUrl },
      { key: "youtube_url", value: body.youtubeUrl },
      { key: "copyright_text", value: body.copyrightText },
      { key: "footer_description", value: body.footerDescription },
    ];

    // Update all settings
    for (const update of updates) {
      await pool.query(
        "UPDATE site_settings SET setting_value = ? WHERE setting_key = ?",
        [update.value || "", update.key]
      );
    }

    return NextResponse.json({
      message: "Site settings updated successfully",
    });
  } catch (err) {
    console.error("[settings/PUT]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}