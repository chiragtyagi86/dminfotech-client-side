// app/api/admin/upload/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/upload
// Accepts a multipart/form-data file upload.
// Saves to /public/uploads/{year}/{month}/{uuid}.{ext}
// Returns: { url: "/uploads/2025/01/abc123.jpg" }
//
// Add to .gitignore:  public/uploads/
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE_MB   = 5;

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file     = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided." }, { status: 400 });
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG." },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { message: `File too large. Maximum size is ${MAX_SIZE_MB}MB.` },
        { status: 400 }
      );
    }

    // Build path: public/uploads/YYYY/MM/
    const now   = new Date();
    const year  = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const ext   = extname(file.name) || `.${file.type.split("/")[1]}`;
    const uuid  = randomUUID();
    const filename = `${uuid}${ext}`;

    const uploadDir = join(process.cwd(), "public", "uploads", year, month);
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, filename), buffer);

    const url = `/uploads/${year}/${month}/${filename}`;
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error("[upload/POST]", err);
    return NextResponse.json({ message: "Upload failed." }, { status: 500 });
  }
}