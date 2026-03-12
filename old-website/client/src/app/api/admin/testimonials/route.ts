// app/api/admin/testimonials/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Testimonials management API endpoint - handles GET, POST operations
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../lib/db";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") || "";

    let query = `SELECT * FROM testimonials WHERE status = 'active'`;
    const params: any[] = [];

    if (search) {
      query += ` AND (client_name LIKE ? OR client_company LIKE ? OR quote LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY featured DESC, created_at DESC`;

    const [rows] = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: rows || [],
    });
  } catch (error) {
    console.error("GET /api/admin/testimonials error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      clientName,
      clientCompany,
      clientRole,
      quote,
      rating,
      shortHighlight,
      featured,
    } = data;

    if (!clientName || !quote) {
      return NextResponse.json(
        { success: false, message: "Client name and quote are required" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `INSERT INTO testimonials (
        client_name, client_company, client_role, quote,
        rating, short_highlight, featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        clientName,
        clientCompany || null,
        clientRole || null,
        quote,
        rating || 5,
        shortHighlight || null,
        featured ? 1 : 0,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial created successfully",
        id: (result as any).insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/testimonials error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}