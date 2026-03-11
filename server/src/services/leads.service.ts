// src/services/leads.service.ts

import db from "../config/db";

// ── Public ────────────────────────────────────────────────────────────────────

export async function createLead(
  body: any,
  sourcePage: string,
  ip: string
): Promise<{ id: number }> {
  const { name, email, phone = "",  message, service = "" } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim())
    throw Object.assign(new Error("Name, email and message are required."), { status: 400 });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw Object.assign(new Error("Invalid email address."), { status: 400 });

  const [result] = await db.query<any>(
    `INSERT INTO leads (name, email, phone,  message, inquiry_type, source_page, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name.trim(), email.trim(), phone.trim(),
     message.trim(), service.trim(), sourcePage, ip]
  );
  return { id: result.insertId };
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAdminLeads(
  page: number, limit: number, status: string, search: string
) {
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const params: unknown[]    = [];

  if (status && status !== "all") { conditions.push("status = ?"); params.push(status); }
  if (search) {
    conditions.push("(name LIKE ? OR email LIKE ? OR message LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countRows] = await db.query<any[]>(`SELECT COUNT(*) AS total FROM leads ${where}`, params);
  const total = (countRows as any[])[0].total;

  const [rows] = await db.query<any[]>(
    `SELECT id, name, email, phone, message, source_page, inquiry_type, status,
            ip_address, views, submitted_at
     FROM leads ${where} ORDER BY submitted_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    data: (rows as any[]).map((l) => ({
      id: l.id, name: l.name, email: l.email, phone: l.phone,
      message: l.message, sourcePage: l.source_page, inquiryType: l.inquiry_type,
      status: l.status, ipAddress: l.ip_address, views: l.views, submittedAt: l.submitted_at,
    })),
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  };
}

export async function getLeadById(id: string) {
  const [rows] = await db.query<any[]>(
    `SELECT id, name, email, phone, message, source_page, inquiry_type, status,
            ip_address, user_agent, views, last_viewed_at, submitted_at
     FROM leads WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) throw Object.assign(new Error("Lead not found"), { status: 404 });

  await db.query("UPDATE leads SET views = views + 1, last_viewed_at = NOW() WHERE id = ?", [id]);

  const l = rows[0];
  return {
    id: l.id, name: l.name, email: l.email, phone: l.phone,
    message: l.message, sourcePage: l.source_page, inquiryType: l.inquiry_type,
    status: l.status, ipAddress: l.ip_address, userAgent: l.user_agent,
    views: l.views + 1, lastViewedAt: l.last_viewed_at, submittedAt: l.submitted_at,
  };
}

export async function updateLeadStatus(id: string, status: string): Promise<void> {
  if (!["new", "contacted", "closed"].includes(status))
    throw Object.assign(new Error("Invalid status"), { status: 400 });

  const [existing] = await db.query<any[]>("SELECT id FROM leads WHERE id = ?", [id]);
  if (existing.length === 0) throw Object.assign(new Error("Lead not found"), { status: 404 });

  await db.query("UPDATE leads SET status = ?, updated_at = NOW() WHERE id = ?", [status, id]);
}

export async function deleteLead(id: string): Promise<void> {
  await db.query("DELETE FROM leads WHERE id = ?", [id]);
}