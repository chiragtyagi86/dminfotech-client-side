// lib/careers-data.ts

import db from "./db";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface JobListing {
  id:               number;
  title:            string;
  slug:             string;
  department:       string | null;
  location:         string | null;
  location_type:    "remote" | "onsite" | "hybrid";
  job_type:         "full-time" | "part-time" | "contract" | "internship";
  salary_min:       number | null;
  salary_max:       number | null;
  salary_label:     string | null;
  description:      string | null;
  requirements:     string | null;
  benefits:         string | null;
  status:           "open" | "closed" | "draft";
  sort_order:       number;
  meta_title:       string | null;
  meta_description: string | null;
  created_at:       string;
  updated_at:       string;
}

export interface JobApplication {
  id:           number;
  job_id:       number;
  name:         string;
  email:        string;
  phone:        string | null;
  linkedin_url: string | null;
  resume_url:   string | null;
  resume_name:  string | null;
  status:       "new" | "reviewing" | "shortlisted" | "rejected" | "hired";
  notes:        string | null;
  created_at:   string;
}

// ── Public queries ─────────────────────────────────────────────────────────────

export async function getAllOpenJobs(): Promise<JobListing[]> {
  const [rows] = await db.query(
    `SELECT * FROM job_listings
     WHERE status = 'open'
     ORDER BY sort_order ASC, created_at DESC`
  );
  return rows as JobListing[];
}

export async function getJobBySlug(slug: string): Promise<JobListing | null> {
  const [rows] = await db.query(
    `SELECT * FROM job_listings WHERE slug = ? LIMIT 1`,
    [slug]
  );
  const jobs = rows as JobListing[];
  return jobs[0] ?? null;
}

export async function getAllJobSlugs(): Promise<{ slug: string }[]> {
  const [rows] = await db.query(
    `SELECT slug FROM job_listings WHERE status = 'open'`
  );
  return rows as { slug: string }[];
}

// ── Admin queries ──────────────────────────────────────────────────────────────

export async function getAllJobsAdmin(): Promise<JobListing[]> {
  const [rows] = await db.query(
    `SELECT * FROM job_listings ORDER BY sort_order ASC, created_at DESC`
  );
  return rows as JobListing[];
}

export async function getJobById(id: number): Promise<JobListing | null> {
  const [rows] = await db.query(
    `SELECT * FROM job_listings WHERE id = ? LIMIT 1`,
    [id]
  );
  const jobs = rows as JobListing[];
  return jobs[0] ?? null;
}

export async function getApplicationsByJobId(jobId: number): Promise<JobApplication[]> {
  const [rows] = await db.query(
    `SELECT * FROM job_applications WHERE job_id = ? ORDER BY created_at DESC`,
    [jobId]
  );
  return rows as JobApplication[];
}

export async function getAllApplications(): Promise<(JobApplication & { job_title: string })[]> {
  const [rows] = await db.query(
    `SELECT a.*, j.title AS job_title
     FROM job_applications a
     JOIN job_listings j ON j.id = a.job_id
     ORDER BY a.created_at DESC`
  );
  return rows as (JobApplication & { job_title: string })[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export function salaryDisplay(job: JobListing): string {
  if (job.salary_label) return job.salary_label;
  if (job.salary_min && job.salary_max)
    return `₹${(job.salary_min / 100000).toFixed(1)}–${(job.salary_max / 100000).toFixed(1)} LPA`;
  if (job.salary_min) return `₹${(job.salary_min / 100000).toFixed(1)}+ LPA`;
  return "Competitive";
}

export function locationTypeLabel(t: string): string {
  return { remote: "Remote", onsite: "On-site", hybrid: "Hybrid" }[t] ?? t;
}

export function jobTypeLabel(t: string): string {
  return {
    "full-time": "Full-time",
    "part-time": "Part-time",
    "contract":  "Contract",
    "internship":"Internship",
  }[t] ?? t;
}