// app/api/admin/team/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Team member operations by ID - handles GET, PUT, DELETE
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
      `SELECT * FROM team_members WHERE id = ? AND status = 'active'`,
      [id]
    );

    const member = (rows as any[])[0];

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("GET /api/admin/team/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch team member" },
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

    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const bio = formData.get("bio") as string;
    const shortDesc = formData.get("shortDesc") as string;
    const email = formData.get("email") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const twitterUrl = formData.get("twitterUrl") as string;
    const websiteUrl = formData.get("websiteUrl") as string;
    const resumeUrl = formData.get("resumeUrl") as string;
    const photoFile = formData.get("photo") as File;
    const signatureFile = formData.get("signature") as File;

    if (!name || !position) {
      return NextResponse.json(
        { success: false, message: "Name and position are required" },
        { status: 400 }
      );
    }

    let photoUrl = null;
    let signatureUrl = null;

    // Handle photo upload if provided
    if (photoFile && photoFile.size > 0) {
      try {
        const bytes = await photoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `team-${id}-${Date.now()}.jpg`;
        photoUrl = `/uploads/team/${filename}`;
      } catch (photoErr) {
        console.warn("Photo upload failed, continuing without photo:", photoErr);
      }
    }

    // Handle signature upload if provided
    if (signatureFile && signatureFile.size > 0) {
      try {
        const bytes = await signatureFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `signature-${id}-${Date.now()}.png`;
        signatureUrl = `/uploads/signatures/${filename}`;
      } catch (sigErr) {
        console.warn("Signature upload failed, continuing without signature:", sigErr);
      }
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (position) {
      updates.push("position = ?");
      values.push(position);
    }
    if (bio !== undefined) {
      updates.push("bio = ?");
      values.push(bio || null);
    }
    if (shortDesc !== undefined) {
      updates.push("short_desc = ?");
      values.push(shortDesc || null);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      values.push(email || null);
    }
    if (linkedinUrl !== undefined) {
      updates.push("linkedin_url = ?");
      values.push(linkedinUrl || null);
    }
    if (twitterUrl !== undefined) {
      updates.push("twitter_url = ?");
      values.push(twitterUrl || null);
    }
    if (websiteUrl !== undefined) {
      updates.push("website_url = ?");
      values.push(websiteUrl || null);
    }
    if (resumeUrl !== undefined) {
      updates.push("resume_url = ?");
      values.push(resumeUrl || null);
    }
    if (photoUrl) {
      updates.push("photo_url = ?");
      values.push(photoUrl);
    }
    if (signatureUrl) {
      updates.push("signature = ?");
      values.push(signatureUrl);
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
      `UPDATE team_members SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: "Team member updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/admin/team/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update team member" },
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
      `SELECT id FROM team_members WHERE id = ? AND status = 'active'`,
      [id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: "Team member not found" },
        { status: 404 }
      );
    }

    await db.query(
      `UPDATE team_members SET status = 'inactive', updated_at = NOW() WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/team/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete team member" },
      { status: 500 }
    );
  }
}