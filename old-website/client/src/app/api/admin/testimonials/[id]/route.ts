// app/api/admin/testimonials/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Testimonials operations by ID - handles GET, PUT, DELETE
// Fixed for Next.js 15+ async params
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../../lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows] = await db.query(
      `SELECT * FROM testimonials WHERE id = ? AND status = 'active'`,
      [id]
    );

    const testimonial = (rows as any[])[0];

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("GET /api/admin/testimonials/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const clientName = formData.get("clientName") as string;
    const clientCompany = formData.get("clientCompany") as string;
    const clientRole = formData.get("clientRole") as string;
    const quote = formData.get("quote") as string;
    const rating = formData.get("rating") as string;
    const shortHighlight = formData.get("shortHighlight") as string;
    const featured = formData.get("featured") as string;
    const photoFile = formData.get("photo") as File;

    if (!clientName || !quote) {
      return NextResponse.json(
        { success: false, message: "Client name and quote are required" },
        { status: 400 }
      );
    }

    let photoUrl = null;

    // Handle photo upload if provided
    if (photoFile && photoFile.size > 0) {
      try {
        const bytes = await photoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `testimonial-${id}-${Date.now()}.jpg`;
        photoUrl = `/uploads/testimonials/${filename}`;
      } catch (photoErr) {
        console.warn("Photo upload failed, continuing without photo:", photoErr);
      }
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (clientName) {
      updates.push("client_name = ?");
      values.push(clientName);
    }
    if (clientCompany !== undefined) {
      updates.push("client_company = ?");
      values.push(clientCompany || null);
    }
    if (clientRole !== undefined) {
      updates.push("client_role = ?");
      values.push(clientRole || null);
    }
    if (quote) {
      updates.push("quote = ?");
      values.push(quote);
    }
    if (rating) {
      updates.push("rating = ?");
      values.push(parseInt(rating));
    }
    if (shortHighlight !== undefined) {
      updates.push("short_highlight = ?");
      values.push(shortHighlight || null);
    }
    if (featured !== undefined) {
      updates.push("featured = ?");
      values.push(featured === "true" ? 1 : 0);
    }
    if (photoUrl) {
      updates.push("client_photo = ?");
      values.push(photoUrl);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, message: "No data to update" },
        { status: 400 }
      );
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    await db.query(
      `UPDATE testimonials SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/admin/testimonials/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows] = await db.query(
      `SELECT id FROM testimonials WHERE id = ? AND status = 'active'`,
      [id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    await db.query(
      `UPDATE testimonials SET status = 'inactive', updated_at = NOW() WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/testimonials/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}