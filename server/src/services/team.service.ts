// src/services/team.service.ts

import db from "../config/db";

export async function getAllTeam(search: string) {
  let query = `SELECT * FROM team_members WHERE status = 'active'`;
  const params: any[] = [];
  if (search) { query += ` AND (name LIKE ? OR position LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
  query += ` ORDER BY created_at DESC`;
  const [rows] = await db.query(query, params);
  return rows;
}

export async function getTeamMemberById(id: string) {
  const [rows] = await db.query(
    `SELECT * FROM team_members WHERE id = ? AND status = 'active'`, [id]
  );
  return (rows as any[])[0] ?? null;
}

export async function createTeamMember(
  data: any,
  photoFile?: Express.Multer.File,
  signatureFile?: Express.Multer.File
): Promise<{ id: number }> {
  const {
    name,
    position,
    bio,
    shortDesc,
    email,
    phone,
    linkedinUrl,
    twitterUrl,
    websiteUrl,
    resumeUrl,
  } = data;

  if (!name || !position) {
    throw Object.assign(new Error("Name and position are required"), { status: 400 });
  }

  const photoUrl = photoFile ? `/uploads/team/${photoFile.filename}` : null;
  const signatureUrl = signatureFile ? `/uploads/team/${signatureFile.filename}` : null;

  const [result] = await db.query<any>(
    `INSERT INTO team_members
     (
       name,
       position,
       bio,
       short_desc,
       email,
       phone,
       linkedin_url,
       twitter_url,
       website_url,
       resume_url,
       photo_url,
       signature,
       status
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
    [
      name,
      position,
      bio || null,
      shortDesc || null,
      email || null,
      phone || null,
      linkedinUrl || null,
      twitterUrl || null,
      websiteUrl || null,
      resumeUrl || null,
      photoUrl,
      signatureUrl,
    ]
  );

  return { id: result.insertId };
}

export async function updateTeamMember(
  id: string,
  data: any,
  photoFile?: Express.Multer.File,
  signatureFile?: Express.Multer.File
): Promise<void> {
  const {
    name,
    position,
    bio,
    shortDesc,
    email,
    phone,
    linkedinUrl,
    twitterUrl,
    websiteUrl,
    resumeUrl,
  } = data;

  if (!name || !position) {
    throw Object.assign(new Error("Name and position are required"), { status: 400 });
  }

  const updates: string[] = [];
  const values: any[] = [];

  const push = (col: string, val: any) => {
    updates.push(`${col} = ?`);
    values.push(val);
  };

  push("name", name);
  push("position", position);
  push("bio", bio || null);
  push("short_desc", shortDesc || null);
  push("email", email || null);
  push("phone", phone || null);
  push("linkedin_url", linkedinUrl || null);
  push("twitter_url", twitterUrl || null);
  push("website_url", websiteUrl || null);
  push("resume_url", resumeUrl || null);

  if (photoFile) push("photo_url", `/uploads/team/${photoFile.filename}`);
  if (signatureFile) push("signature", `/uploads/team/${signatureFile.filename}`);

  updates.push("updated_at = NOW()");
  values.push(id);

  await db.query(`UPDATE team_members SET ${updates.join(", ")} WHERE id = ?`, values);
}

export async function deleteTeamMember(id: string): Promise<void> {
  const [rows] = await db.query(
    `SELECT id FROM team_members WHERE id = ? AND status = 'active'`, [id]
  );
  if ((rows as any[]).length === 0)
    throw Object.assign(new Error("Team member not found"), { status: 404 });
  await db.query(`UPDATE team_members SET status = 'inactive', updated_at = NOW() WHERE id = ?`, [id]);
}