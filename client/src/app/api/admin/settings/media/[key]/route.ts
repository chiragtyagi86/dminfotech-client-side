// app/api/admin/settings/media/[key]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import pool from "../../../../../../../lib/db";
import { requireAdmin } from "../../../../../../../lib/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { key } = await context.params;

    // Get file path from database
    const [rows] = await pool.query<any[]>(
      "SELECT file_path FROM site_media WHERE media_key = ?",
      [key]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Media not found" }, { status: 404 });
    }

    const filePath = (rows as any[])[0].file_path;
    const fullPath = join(process.cwd(), "public", filePath);

    // Delete file from filesystem
    try {
      await unlink(fullPath);
    } catch (err) {
      console.warn("File not found on disk:", fullPath);
    }

    // Delete from database
    await pool.query("DELETE FROM site_media WHERE media_key = ?", [key]);

    return NextResponse.json({
      message: "Media deleted successfully",
    });
  } catch (err) {
    console.error("[settings/media/[key]/DELETE]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}