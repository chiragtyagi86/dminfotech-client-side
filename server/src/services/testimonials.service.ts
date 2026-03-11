// src/services/testimonials.service.ts

import db from "../config/db";

export async function getAllTestimonials(search: string) {
  let query = `SELECT * FROM testimonials WHERE status = 'active'`;
  const params: any[] = [];
  if (search) {
    query += ` AND (client_name LIKE ? OR client_company LIKE ? OR quote LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  query += ` ORDER BY featured DESC, created_at DESC`;
  const [rows] = await db.query(query, params);
  return rows;
}

export async function getTestimonialById(id: string) {
  const [rows] = await db.query(
    `SELECT * FROM testimonials WHERE id = ? AND status = 'active'`, [id]
  );
  return (rows as any[])[0] ?? null;
}

export async function createTestimonial(data: any): Promise<{ id: number }> {
  const { clientName, clientCompany, clientRole, quote, rating, shortHighlight, featured } = data;
  if (!clientName || !quote)
    throw Object.assign(new Error("Client name and quote are required"), { status: 400 });

  const [result] = await db.query<any>(
    `INSERT INTO testimonials
     (client_name, client_company, client_role, quote, rating, short_highlight, featured, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
    [clientName, clientCompany || null, clientRole || null, quote,
     rating || 5, shortHighlight || null, featured ? 1 : 0]
  );
  return { id: result.insertId };
}

export async function updateTestimonial(
  id: string, data: any, photoFile?: Express.Multer.File
): Promise<void> {
  const { clientName, clientCompany, clientRole, quote, rating, shortHighlight, featured } = data;
  if (!clientName || !quote)
    throw Object.assign(new Error("Client name and quote are required"), { status: 400 });

  const updates: string[] = [];
  const values: any[]     = [];

  const push = (col: string, val: any) => { updates.push(`${col} = ?`); values.push(val); };

  push("client_name",     clientName);
  push("client_company",  clientCompany  || null);
  push("client_role",     clientRole     || null);
  push("quote",           quote);
  push("rating",          parseInt(rating) || 5);
  push("short_highlight", shortHighlight || null);
  push("featured",        featured === "true" || featured === true ? 1 : 0);
  if (photoFile) push("client_photo", `/uploads/testimonials/${photoFile.filename}`);

  updates.push("updated_at = NOW()");
  values.push(id);

  await db.query(`UPDATE testimonials SET ${updates.join(", ")} WHERE id = ?`, values);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const [rows] = await db.query(`SELECT id FROM testimonials WHERE id = ? AND status = 'active'`, [id]);
  if ((rows as any[]).length === 0)
    throw Object.assign(new Error("Testimonial not found"), { status: 404 });
  await db.query(`UPDATE testimonials SET status = 'inactive', updated_at = NOW() WHERE id = ?`, [id]);
}

export async function toggleFeatured(id: string): Promise<{ featured: boolean }> {
  const [rows] = await db.query(`SELECT featured FROM testimonials WHERE id = ? AND status = 'active'`, [id]);
  const t = (rows as any[])[0];
  if (!t) throw Object.assign(new Error("Testimonial not found"), { status: 404 });
  const newVal = t.featured ? 0 : 1;
  await db.query(`UPDATE testimonials SET featured = ?, updated_at = NOW() WHERE id = ?`, [newVal, id]);
  return { featured: newVal === 1 };
}