// app/api/admin/settings/media/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import pool from "../../../../../../lib/db";
import { requireAdmin } from "../../../../../../lib/auth";

const UPLOAD_DIR = join(process.cwd(), "public/uploads/settings");
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const mediaKey = formData.get("mediaKey") as string;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: "File too large. Maximum 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create upload directory if it doesn't exist
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const timestamp = Date.now();
    const fileName = `${mediaKey}-${timestamp}.${ext}`;
    const filePath = join(UPLOAD_DIR, fileName);
    const publicPath = `/uploads/settings/${fileName}`;

    // Write file
    await writeFile(filePath, buffer);

    // Save to database
    await pool.query(
      `INSERT INTO site_media (media_key, file_name, file_path, file_type, file_size, media_type)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE file_name = VALUES(file_name), file_path = VALUES(file_path),
                              file_type = VALUES(file_type), file_size = VALUES(file_size),
                              updated_at = NOW()`,
      [
        mediaKey,
        fileName,
        publicPath,
        file.type,
        file.size,
        mediaKey === "logo" ? "logo" : mediaKey === "favicon" ? "favicon" : "social_image",
      ]
    );

    return NextResponse.json({
      message: "Media uploaded successfully",
      filePath: publicPath,
      fileName: fileName,
    });
  } catch (err) {
    console.error("[settings/media/POST]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}