// app/api/admin/dashboard/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/dashboard → fetch real dashboard statistics
// Returns counts for pages, blog posts, leads, team members, etc.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    // Get pages count
    const [pagesRows] = await pool.query<any[]>(
      "SELECT COUNT(*) as count FROM pages"
    );
    const pages = (pagesRows as any[])[0]?.count || 0;

    // Get blog posts count
    const [blogRows] = await pool.query<any[]>(
      "SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'"
    );
    const blogPosts = (blogRows as any[])[0]?.count || 0;

    // Get draft blog posts count
    const [draftRows] = await pool.query<any[]>(
      "SELECT COUNT(*) as count FROM blog_posts WHERE status = 'draft'"
    );
    const draftPosts = (draftRows as any[])[0]?.count || 0;

    // Get total leads count
    const [leadsRows] = await pool.query<any[]>(
      "SELECT COUNT(*) as count FROM leads"
    );
    const leads = (leadsRows as any[])[0]?.count || 0;

    // Get new (unread) leads count
    const [newLeadsRows] = await pool.query<any[]>(
      "SELECT COUNT(*) as count FROM leads WHERE status = 'new'"
    );
    const newLeads = (newLeadsRows as any[])[0]?.count || 0;

    // Get active team members count
    const [teamRows] = await pool.query<any[]>(
      "SELECT COUNT(*) as count FROM team_members WHERE is_active = true"
    );
    const teamMembers = (teamRows as any[])[0]?.count || 0;

    return NextResponse.json({
      data: {
        pages,
        blogPosts,
        draftPosts,
        leads,
        newLeads,
        teamMembers,
      },
    });
  } catch (err) {
    console.error("[dashboard/GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}