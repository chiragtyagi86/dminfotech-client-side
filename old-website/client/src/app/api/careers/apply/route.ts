// app/api/careers/apply/route.ts
// POST /api/careers/apply  — submit job application (multipart/form-data)

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import db from "../../../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const jobId      = formData.get("jobId")      as string;
    const name       = formData.get("name")       as string;
    const email      = formData.get("email")      as string;
    const phone      = formData.get("phone")      as string | null;
    const linkedinUrl= formData.get("linkedinUrl")as string | null;
    const resumeFile = formData.get("resume")     as File | null;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!jobId || !name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { message: "Name, email and job ID are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
    }

    // ── Check job exists and is open ─────────────────────────────────────────
    const [jobRows] = await db.query<any[]>(
      "SELECT id, title, status FROM job_listings WHERE id = ? LIMIT 1",
      [jobId]
    );
    if (!jobRows.length || jobRows[0].status !== "open") {
      return NextResponse.json(
        { message: "This position is no longer accepting applications." },
        { status: 400 }
      );
    }

    // ── Duplicate check (same email + job) ───────────────────────────────────
    const [dupRows] = await db.query<any[]>(
      "SELECT id FROM job_applications WHERE job_id = ? AND email = ? LIMIT 1",
      [jobId, email.toLowerCase().trim()]
    );
    if (dupRows.length > 0) {
      return NextResponse.json(
        { message: "You have already applied for this position." },
        { status: 409 }
      );
    }

    // ── Handle resume upload ──────────────────────────────────────────────────
    let resumeUrl:  string | null = null;
    let resumeName: string | null = null;

    if (resumeFile && resumeFile.size > 0) {
      // Validate file type
      const allowed = ["application/pdf", "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowed.includes(resumeFile.type)) {
        return NextResponse.json(
          { message: "Resume must be a PDF or Word document." },
          { status: 400 }
        );
      }
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ message: "Resume must be under 5MB." }, { status: 400 });
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
      await mkdir(uploadDir, { recursive: true });

      const ext      = resumeFile.name.split(".").pop();
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = path.join(uploadDir, safeName);

      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      await writeFile(filePath, buffer);

      resumeUrl  = `/uploads/resumes/${safeName}`;
      resumeName = resumeFile.name;
    }

    // ── Get IP address ────────────────────────────────────────────────────────
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
              || request.headers.get("x-real-ip")
              || null;

    // ── Insert application ────────────────────────────────────────────────────
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
        ip,
      ]
    );

    return NextResponse.json({
      message: "Application submitted successfully! We'll be in touch soon.",
    });
  } catch (err) {
    console.error("[POST /api/careers/apply]", err);
    return NextResponse.json({ message: "Server error. Please try again." }, { status: 500 });
  }
}