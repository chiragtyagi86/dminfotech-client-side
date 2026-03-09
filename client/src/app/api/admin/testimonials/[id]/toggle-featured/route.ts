import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../../../lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get current featured status
    const [rows] = await db.query(
      `SELECT featured FROM testimonials WHERE id = ? AND status = 'active'`,
      [id]
    );

    const testimonial = (rows as any[])[0];

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Toggle featured
    const newFeaturedStatus = testimonial.featured ? 0 : 1;

    await db.query(
      `UPDATE testimonials SET featured = ?, updated_at = NOW() WHERE id = ?`,
      [newFeaturedStatus, id]
    );

    return NextResponse.json({
      success: true,
      featured: newFeaturedStatus === 1,
      message: `Testimonial ${newFeaturedStatus === 1 ? "featured" : "unfeatured"} successfully`,
    });
  } catch (error) {
    console.error("PUT /api/admin/testimonials/[id]/toggle-featured error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to toggle featured status" },
      { status: 500 }
    );
  }
}