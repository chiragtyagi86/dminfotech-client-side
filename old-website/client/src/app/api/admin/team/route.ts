// app/api/admin/team/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Team management API endpoint - handles GET, POST operations
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../lib/db";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") || "";

    let query = `SELECT * FROM team_members WHERE status = 'active'`;
    const params: any[] = [];

    if (search) {
      query += ` AND (name LIKE ? OR position LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: rows || [],
    });
  } catch (error) {
    console.error("GET /api/admin/team error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      name,
      position,
      bio,
      shortDesc,
      email,
      linkedinUrl,
      twitterUrl,
      websiteUrl,
      resumeUrl,
    } = data;

    if (!name || !position) {
      return NextResponse.json(
        { success: false, message: "Name and position are required" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `INSERT INTO team_members (
        name, position, bio, short_desc, email,
        linkedin_url, twitter_url, website_url, resume_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        name,
        position,
        bio || null,
        shortDesc || null,
        email || null,
        linkedinUrl || null,
        twitterUrl || null,
        websiteUrl || null,
        resumeUrl || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Team member created successfully",
        id: (result as any).insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/team error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create team member" },
      { status: 500 }
    );
  }
}