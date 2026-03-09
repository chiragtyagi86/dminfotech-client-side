// lib/testimonials-data.ts
import db from "./db";

export type Testimonial = {
  id: number;
  clientName: string;
  clientCompany: string;
  clientRole: string;
  clientPhoto?: string;
  quote: string;
  rating: number;
  shortHighlight?: string;
  featured?: boolean;
  createdAt?: Date;
};

function transformRow(row: any): Testimonial {
  return {
    id: Number(row.id),
    clientName: row.client_name,
    clientCompany: row.client_company,
    clientRole: row.client_role,
    clientPhoto: row.client_photo || undefined,
    quote: row.quote,
    rating: Number(row.rating),
    shortHighlight: row.short_highlight || undefined,
    featured:
      row.featured === 1 ||
      row.featured === true ||
      row.featured === "1",
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
  };
}

function extractRows(result: any): any[] {
  if (!result) return [];

  // mysql2/promise => [rows, fields]
  if (Array.isArray(result)) {
    if (Array.isArray(result[0])) return result[0];
    return result;
  }

  // some drivers => { rows: [...] }
  if (result.rows && Array.isArray(result.rows)) {
    return result.rows;
  }

  return [];
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const result = await db.query(
      `SELECT 
        id,
        client_name,
        client_company,
        client_role,
        client_photo,
        quote,
        rating,
        short_highlight,
        featured,
        created_at
      FROM testimonials
      WHERE status = 'active'
      ORDER BY featured DESC, created_at DESC`
    );

    const rows = extractRows(result);
    return rows.map(transformRow);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const result = await db.query(
      `SELECT 
        id,
        client_name,
        client_company,
        client_role,
        client_photo,
        quote,
        rating,
        short_highlight,
        featured,
        created_at
      FROM testimonials
      WHERE featured = 1 AND status = 'active'
      ORDER BY created_at DESC`
    );

    const rows = extractRows(result);
    return rows.map(transformRow);
  } catch (error) {
    console.error("Failed to fetch featured testimonials:", error);
    return [];
  }
}

export async function getTestimonialById(id: number): Promise<Testimonial | null> {
  try {
    const result = await db.query(
      `SELECT 
        id,
        client_name,
        client_company,
        client_role,
        client_photo,
        quote,
        rating,
        short_highlight,
        featured,
        created_at
      FROM testimonials
      WHERE id = ? AND status = 'active'`,
      [id]
    );

    const rows = extractRows(result);
    return rows.length > 0 ? transformRow(rows[0]) : null;
  } catch (error) {
    console.error(`Failed to fetch testimonial ${id}:`, error);
    return null;
  }
}

export async function getTestimonialsByRating(minRating: number): Promise<Testimonial[]> {
  try {
    const result = await db.query(
      `SELECT 
        id,
        client_name,
        client_company,
        client_role,
        client_photo,
        quote,
        rating,
        short_highlight,
        featured,
        created_at
      FROM testimonials
      WHERE rating >= ? AND status = 'active'
      ORDER BY featured DESC, rating DESC, created_at DESC`,
      [minRating]
    );

    const rows = extractRows(result);
    return rows.map(transformRow);
  } catch (error) {
    console.error(`Failed to fetch testimonials with rating >= ${minRating}:`, error);
    return [];
  }
}

export async function createTestimonial(
  data: Omit<Testimonial, "id" | "createdAt">
): Promise<Testimonial | null> {
  try {
    const result: any = await db.query(
      `INSERT INTO testimonials (
        client_name,
        client_company,
        client_role,
        client_photo,
        quote,
        rating,
        short_highlight,
        featured,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        data.clientName,
        data.clientCompany,
        data.clientRole,
        data.clientPhoto || null,
        data.quote,
        data.rating,
        data.shortHighlight || null,
        data.featured ? 1 : 0,
      ]
    );

    const insertId =
      result?.insertId ||
      result?.[0]?.insertId ||
      result?.rows?.insertId;

    if (!insertId) return null;

    return await getTestimonialById(Number(insertId));
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return null;
  }
}

export async function updateTestimonial(
  id: number,
  data: Partial<Testimonial>
): Promise<Testimonial | null> {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.clientName !== undefined) {
      updates.push(`client_name = ?`);
      values.push(data.clientName);
    }
    if (data.clientCompany !== undefined) {
      updates.push(`client_company = ?`);
      values.push(data.clientCompany);
    }
    if (data.clientRole !== undefined) {
      updates.push(`client_role = ?`);
      values.push(data.clientRole);
    }
    if (data.clientPhoto !== undefined) {
      updates.push(`client_photo = ?`);
      values.push(data.clientPhoto || null);
    }
    if (data.quote !== undefined) {
      updates.push(`quote = ?`);
      values.push(data.quote);
    }
    if (data.rating !== undefined) {
      updates.push(`rating = ?`);
      values.push(data.rating);
    }
    if (data.shortHighlight !== undefined) {
      updates.push(`short_highlight = ?`);
      values.push(data.shortHighlight || null);
    }
    if (data.featured !== undefined) {
      updates.push(`featured = ?`);
      values.push(data.featured ? 1 : 0);
    }

    if (updates.length === 0) {
      return getTestimonialById(id);
    }

    values.push(id);

    await db.query(
      `UPDATE testimonials
       SET ${updates.join(", ")}, updated_at = NOW()
       WHERE id = ?`,
      values
    );

    return getTestimonialById(id);
  } catch (error) {
    console.error(`Failed to update testimonial ${id}:`, error);
    return null;
  }
}

export async function deleteTestimonial(id: number): Promise<boolean> {
  try {
    await db.query(
      `UPDATE testimonials
       SET status = 'inactive', updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    return true;
  } catch (error) {
    console.error(`Failed to delete testimonial ${id}:`, error);
    return false;
  }
}

export async function toggleTestimonialFeatured(id: number): Promise<Testimonial | null> {
  try {
    await db.query(
      `UPDATE testimonials
       SET featured = NOT featured, updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    return getTestimonialById(id);
  } catch (error) {
    console.error(`Failed to toggle featured for testimonial ${id}:`, error);
    return null;
  }
}

export async function getTestimonialStats() {
  try {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN featured = 1 THEN 1 END) as featured,
        ROUND(AVG(rating), 2) as averageRating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as fiveStarCount
      FROM testimonials
      WHERE status = 'active'`
    );

    const rows = extractRows(result);
    const stats = rows[0];

    return {
      total: Number(stats?.total || 0),
      featured: Number(stats?.featured || 0),
      averageRating: Number(stats?.averageRating || 0),
      fiveStarCount: Number(stats?.fiveStarCount || 0),
    };
  } catch (error) {
    console.error("Failed to fetch testimonial statistics:", error);
    return {
      total: 0,
      featured: 0,
      averageRating: 0,
      fiveStarCount: 0,
    };
  }
}