// src/services/careers.service.ts

import db from "../config/db";
import path from "path";
import { renderCareerApplicationEmail, sendMail } from "./mailer.service";

// ── Public ────────────────────────────────────────────────────────────────────

export async function getAllOpenJobs() {
  const [rows] = await db.query(
    `SELECT * FROM job_listings WHERE status = 'open' ORDER BY sort_order ASC, created_at DESC`
  );
  return rows;
}

export async function getJobBySlug(slug: string) {
  const [rows] = await db.query<any[]>(
    `SELECT * FROM job_listings WHERE slug = ? LIMIT 1`, [slug]
  );
  return (rows as any[])[0] ?? null;
}

export async function submitApplication(
  fields: {
    jobId: string; name: string; email: string;
    phone?: string; linkedinUrl?: string;
  },
  resumeFile?: Express.Multer.File,
  ip?: string
): Promise<void> {
  const { jobId, name, email, phone, linkedinUrl } = fields;

  // Validate required
  if (!jobId || !name?.trim() || !email?.trim())
    throw Object.assign(new Error("Name, email and job ID are required."), { status: 400 });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw Object.assign(new Error("Invalid email address."), { status: 400 });

  // Check job is open
  const [jobRows] = await db.query<any[]>(
    "SELECT id, title, status FROM job_listings WHERE id = ? LIMIT 1", [jobId]
  );
  if (!jobRows.length || jobRows[0].status !== "open")
    throw Object.assign(new Error("This position is no longer accepting applications."), { status: 400 });

  // Duplicate check
  const [dupRows] = await db.query<any[]>(
    "SELECT id FROM job_applications WHERE job_id = ? AND email = ? LIMIT 1",
    [jobId, email.toLowerCase().trim()]
  );
  if (dupRows.length > 0)
    throw Object.assign(new Error("You have already applied for this position."), { status: 409 });

  let resumeUrl: string | null  = null;
  let resumeName: string | null = null;

  if (resumeFile) {
    resumeUrl  = `/uploads/resumes/${resumeFile.filename}`;
    resumeName = resumeFile.originalname;
  }

  await db.query(
    `INSERT INTO job_applications
     (job_id, name, email, phone, linkedin_url, resume_url, resume_name, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      parseInt(jobId),
      name.trim(),
      email.toLowerCase().trim(),
      phone?.trim()       || null,
      linkedinUrl?.trim() || null,
      resumeUrl,
      resumeName,
      ip || null,
    ]
  );
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAdminJobs() {
  const [rows] = await db.query<any[]>(
    `SELECT j.*, COUNT(a.id) AS _applicationCount
     FROM job_listings j
     LEFT JOIN job_applications a ON a.job_id = j.id
     GROUP BY j.id ORDER BY j.sort_order ASC, j.created_at DESC`
  );
  return rows;
}

export async function getAdminJobById(id: string) {
  const [rows] = await db.query<any[]>("SELECT * FROM job_listings WHERE id = ? LIMIT 1", [id]);
  return (rows as any[])[0] ?? null;
}

export async function createJob(body: any): Promise<{ id: number }> {
  const { title, slug, department, location, location_type, job_type,
          salary_label, description, requirements, benefits, status, sort_order,
          meta_title, meta_description } = body;

  if (!title?.trim()) throw Object.assign(new Error("Title is required."), { status: 400 });
  if (!slug?.trim())  throw Object.assign(new Error("Slug is required."),  { status: 400 });

  const [existing] = await db.query<any[]>("SELECT id FROM job_listings WHERE slug = ? LIMIT 1", [slug]);
  if ((existing as any[]).length > 0)
    throw Object.assign(new Error("A job with this slug already exists."), { status: 409 });

  const [result] = await db.query<any>(
    `INSERT INTO job_listings
     (title, slug, department, location, location_type, job_type, salary_label,
      description, requirements, benefits, status, sort_order, meta_title, meta_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title.trim(), slug.trim(), department || null, location || null,
     location_type || "onsite", job_type || "full-time", salary_label || null,
     description || null, requirements || null, benefits || null,
     status || "draft", sort_order ?? 0, meta_title || null, meta_description || null]
  );
  return { id: result.insertId };
}

export async function updateJob(id: string, body: any): Promise<void> {
  const { title, slug, department, location, location_type, job_type,
          salary_label, description, requirements, benefits, status, sort_order,
          meta_title, meta_description } = body;

  if (!title?.trim()) throw Object.assign(new Error("Title is required."), { status: 400 });
  if (!slug?.trim())  throw Object.assign(new Error("Slug is required."),  { status: 400 });

  const [existing] = await db.query<any[]>(
    "SELECT id FROM job_listings WHERE slug = ? AND id != ? LIMIT 1", [slug, id]
  );
  if ((existing as any[]).length > 0)
    throw Object.assign(new Error("Another job uses this slug."), { status: 409 });

  await db.query(
    `UPDATE job_listings SET title=?, slug=?, department=?, location=?, location_type=?,
                             job_type=?, salary_label=?, description=?, requirements=?,
                             benefits=?, status=?, sort_order=?, meta_title=?,
                             meta_description=?, updated_at=NOW()
     WHERE id=?`,
    [title.trim(), slug.trim(), department || null, location || null,
     location_type || "onsite", job_type || "full-time", salary_label || null,
     description || null, requirements || null, benefits || null,
     status || "draft", sort_order ?? 0, meta_title || null, meta_description || null, id]
  );
}

export async function patchJobStatus(id: string, status: string): Promise<void> {
  const allowed = ["open", "closed", "draft"];
  if (!allowed.includes(status))
    throw Object.assign(new Error("Invalid status."), { status: 400 });
  await db.query("UPDATE job_listings SET status=?, updated_at=NOW() WHERE id=?", [status, id]);
}

export async function deleteJob(id: string): Promise<void> {
  await db.query("DELETE FROM job_applications WHERE job_id = ?", [id]);
  await db.query("DELETE FROM job_listings WHERE id = ?", [id]);
}

// ── Applications ──────────────────────────────────────────────────────────────

export async function getApplicationsByJobId(jobId: string) {
  const [job] = await db.query<any[]>(
    "SELECT id, title, slug, status FROM job_listings WHERE id = ? LIMIT 1", [jobId]
  );
  if (!(job as any[]).length) throw Object.assign(new Error("Job not found."), { status: 404 });

  const [apps] = await db.query<any[]>(
    `SELECT id, name, email, phone, linkedin_url, resume_url, resume_name,
            status, notes, created_at
     FROM job_applications WHERE job_id = ? ORDER BY created_at DESC`,
    [jobId]
  );
  return { job: (job as any[])[0], applications: apps };
}

export async function updateApplication(
  appId: string,
  status?: string,
  notes?: string,
  email?: { send?: boolean; subject?: string; message?: string; statusLabel?: string }
): Promise<void> {
  const allowed = ["new", "reviewing", "shortlisted", "rejected", "hired"];
  const normalizedStatus = status?.trim().toLowerCase();
  if (normalizedStatus && !allowed.includes(normalizedStatus))
    throw Object.assign(new Error("Invalid status."), { status: 400 });

  const updates: string[] = [];
  const values:  any[]    = [];

  if (status !== undefined) { updates.push("status = ?"); values.push(normalizedStatus); }
  if (notes  !== undefined) { updates.push("notes = ?");  values.push(notes);  }
  if (!updates.length && !email?.send) {
    throw Object.assign(new Error("Nothing to update."), { status: 400 });
  }

  if (updates.length) {
    updates.push("updated_at = NOW()");
    values.push(appId);
    const [result] = await db.query<any>(
      `UPDATE job_applications SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) {
      throw Object.assign(new Error("Application not found."), { status: 404 });
    }
  }

  if (email?.send) {
    const [rows] = await db.query<any[]>(
      `SELECT a.name, a.email, a.status, j.title AS job_title
       FROM job_applications a
       JOIN job_listings j ON j.id = a.job_id
       WHERE a.id = ?
       LIMIT 1`,
      [appId]
    );

    if (!rows.length) {
      throw Object.assign(new Error("Application not found."), { status: 404 });
    }

    const app = rows[0];
    const statusLabel = email.statusLabel || labelForStatus(normalizedStatus || app.status);
    const subject = email.subject?.trim() || `Update on your DM Infotech application`;
    const message = email.message?.trim() || defaultApplicationMessage(statusLabel, app.job_title);

    await sendMail({
      to: app.email,
      subject,
      html: renderCareerApplicationEmail({
        candidateName: app.name,
        jobTitle: app.job_title,
        statusLabel,
        message,
      }),
    });
  }
}

function labelForStatus(status?: string) {
  const labels: Record<string, string> = {
    new: "Application Received",
    reviewing: "Application Under Review",
    shortlisted: "You Have Been Shortlisted",
    rejected: "Application Update",
    hired: "Congratulations from DM Infotech",
  };
  return labels[String(status || "").toLowerCase()] || "Application Update";
}

function defaultApplicationMessage(statusLabel: string, jobTitle: string) {
  if (statusLabel.includes("Shortlisted")) {
    return `Thank you for applying to DM Infotech. We are pleased to let you know that your profile has been shortlisted for ${jobTitle}. Our team will contact you with the next steps shortly.`;
  }

  if (statusLabel.includes("Congratulations")) {
    return `Congratulations. We are happy to inform you that you have been selected for ${jobTitle} at DM Infotech. Our team will reach out with onboarding details.`;
  }

  if (statusLabel === "Application Update") {
    return `Thank you for your interest in ${jobTitle} at DM Infotech. After careful review, we are unable to move forward with your application at this stage. We appreciate your time and wish you success in your career journey.`;
  }

  if (statusLabel.includes("Review")) {
    return `Thank you for applying to DM Infotech. Your application for ${jobTitle} is currently under review. We will update you once the next decision is available.`;
  }

  return `Thank you for applying to DM Infotech. We have received your application for ${jobTitle} and our team will review it shortly.`;
}
