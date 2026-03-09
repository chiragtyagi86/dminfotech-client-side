// lib/team-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// Team member data fetching from database
// ─────────────────────────────────────────────────────────────────────────────

import db from "./db";

export type TeamMember = {
  id: number;
  name: string;
  position: string;
  bio: string;
  shortDesc: string;
  photoUrl: string;
  signature?: string;
  email?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  resumeUrl?: string;
  createdAt?: Date;
};

/**
 * Transform database row to TeamMember type
 */
function transformRow(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    bio: row.bio,
    shortDesc: row.short_desc,
    photoUrl: row.photo_url,
    signature: row.signature,
    email: row.email,
    linkedinUrl: row.linkedin_url,
    twitterUrl: row.twitter_url,
    websiteUrl: row.website_url,
    resumeUrl: row.resume_url,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
  };
}

/**
 * Helper to handle both MySQL result formats
 */
function extractRows(result: any): any[] {
  if (!result) return [];
  if (Array.isArray(result)) {
    // mysql2/promise returns [rows, fields]
    return Array.isArray(result[0]) ? result[0] : result;
  }
  if (result.rows && Array.isArray(result.rows)) {
    // Some drivers return { rows: [] }
    return result.rows;
  }
  return Array.isArray(result) ? result : [];
}

/**
 * Fetch all team members from database
 * Orders by creation date (newest first)
 */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    const result = await db.query(
      `SELECT 
        id,
        name,
        position,
        bio,
        short_desc,
        photo_url,
        signature,
        email,
        linkedin_url,
        twitter_url,
        website_url,
        resume_url,
        created_at
      FROM team_members
      WHERE status = 'active'
      ORDER BY created_at DESC`
    );

    const rows = extractRows(result);
    return rows.map(transformRow);
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
}

/**
 * Fetch a single team member by ID
 */
export async function getTeamMemberById(id: number): Promise<TeamMember | null> {
  try {
    const result = await db.query(
      `SELECT 
        id,
        name,
        position,
        bio,
        short_desc,
        photo_url,
        signature,
        email,
        linkedin_url,
        twitter_url,
        website_url,
        resume_url,
        created_at
      FROM team_members
      WHERE id = ? AND status = 'active'`,
      [id]
    );

    const rows = extractRows(result);
    return rows.length > 0 ? transformRow(rows[0]) : null;
  } catch (error) {
    console.error(`Failed to fetch team member ${id}:`, error);
    return null;
  }
}

/**
 * Fetch team members by position
 */
export async function getTeamMembersByPosition(position: string): Promise<TeamMember[]> {
  try {
    const result = await db.query(
      `SELECT 
        id,
        name,
        position,
        bio,
        short_desc,
        photo_url,
        signature,
        email,
        linkedin_url,
        twitter_url,
        website_url,
        resume_url,
        created_at
      FROM team_members
      WHERE position ILIKE ? AND status = 'active'
      ORDER BY created_at DESC`,
      [`%${position}%`]
    );

    const rows = extractRows(result);
    return rows.map(transformRow);
  } catch (error) {
    console.error(`Failed to fetch team members by position ${position}:`, error);
    return [];
  }
}

/**
 * Create a new team member (Admin function)
 */
export async function createTeamMember(data: Omit<TeamMember, 'id' | 'createdAt'>): Promise<TeamMember | null> {
  try {
    await db.query(
      `INSERT INTO team_members (
        name,
        position,
        bio,
        short_desc,
        photo_url,
        signature,
        email,
        linkedin_url,
        twitter_url,
        website_url,
        resume_url,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        data.name,
        data.position,
        data.bio,
        data.shortDesc || null,
        data.photoUrl || null,
        data.signature || null,
        data.email || null,
        data.linkedinUrl || null,
        data.twitterUrl || null,
        data.websiteUrl || null,
        data.resumeUrl || null,
      ]
    );

    return data as TeamMember;
  } catch (error) {
    console.error("Failed to create team member:", error);
    return null;
  }
}

/**
 * Update a team member (Admin function)
 */
export async function updateTeamMember(id: number, data: Partial<TeamMember>): Promise<TeamMember | null> {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    // Build dynamic UPDATE query
    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.position !== undefined) {
      updates.push("position = ?");
      values.push(data.position);
    }
    if (data.bio !== undefined) {
      updates.push("bio = ?");
      values.push(data.bio);
    }
    if (data.shortDesc !== undefined) {
      updates.push("short_desc = ?");
      values.push(data.shortDesc);
    }
    if (data.photoUrl !== undefined) {
      updates.push("photo_url = ?");
      values.push(data.photoUrl);
    }
    if (data.signature !== undefined) {
      updates.push("signature = ?");
      values.push(data.signature);
    }
    if (data.email !== undefined) {
      updates.push("email = ?");
      values.push(data.email);
    }
    if (data.linkedinUrl !== undefined) {
      updates.push("linkedin_url = ?");
      values.push(data.linkedinUrl);
    }
    if (data.twitterUrl !== undefined) {
      updates.push("twitter_url = ?");
      values.push(data.twitterUrl);
    }
    if (data.websiteUrl !== undefined) {
      updates.push("website_url = ?");
      values.push(data.websiteUrl);
    }
    if (data.resumeUrl !== undefined) {
      updates.push("resume_url = ?");
      values.push(data.resumeUrl);
    }

    if (updates.length === 0) {
      return getTeamMemberById(id);
    }

    values.push(id);

    await db.query(
      `UPDATE team_members 
      SET ${updates.join(", ")}, updated_at = NOW()
      WHERE id = ?`,
      values
    );

    return getTeamMemberById(id);
  } catch (error) {
    console.error(`Failed to update team member ${id}:`, error);
    return null;
  }
}

/**
 * Delete a team member (Admin function)
 */
export async function deleteTeamMember(id: number): Promise<boolean> {
  try {
    await db.query(
      `UPDATE team_members SET status = 'inactive' WHERE id = ?`,
      [id]
    );

    return true;
  } catch (error) {
    console.error(`Failed to delete team member ${id}:`, error);
    return false;
  }
}

/**
 * Get team statistics
 */
export async function getTeamStats() {
  try {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT position) as positions
      FROM team_members
      WHERE status = 'active'`
    );

    const rows = extractRows(result);
    const stats = rows[0];
    
    return {
      total: stats?.total || 0,
      positions: stats?.positions || 0,
    };
  } catch (error) {
    console.error("Failed to fetch team statistics:", error);
    return {
      total: 0,
      positions: 0,
    };
  }
}