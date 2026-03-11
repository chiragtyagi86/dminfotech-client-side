// src/controllers/careers.controller.ts

import { Request, Response } from "express";
import * as careersService from "../services/careers.service";

// ── Public ────────────────────────────────────────────────────────────────────

export async function getAllOpenJobs(_req: Request, res: Response): Promise<void> {
  try { res.json(await careersService.getAllOpenJobs()); }
  catch (err) { console.error("[careers/getAllOpenJobs]", err); res.status(500).json({ message: "Server error." }); }
}

export async function getJobBySlug(req: Request, res: Response): Promise<void> {
  try {
    const job = await careersService.getJobBySlug(req.params.slug);
    if (!job) { res.status(404).json({ message: "Job not found." }); return; }
    res.json(job);
  } catch (err) { console.error("[careers/getJobBySlug]", err); res.status(500).json({ message: "Server error." }); }
}

export async function submitApplication(req: Request, res: Response): Promise<void> {
  try {
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0].trim()
              || req.headers["x-real-ip"]?.toString()
              || req.ip;
    await careersService.submitApplication(req.body, req.file, ip);
    res.json({ message: "Application submitted successfully! We'll be in touch soon." });
  } catch (err: any) {
    console.error("[careers/submitApplication]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function adminGetJobs(_req: Request, res: Response): Promise<void> {
  try { res.json({ jobs: await careersService.getAdminJobs() }); }
  catch (err) { console.error("[careers/adminGetJobs]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminGetJobById(req: Request, res: Response): Promise<void> {
  try {
    const job = await careersService.getAdminJobById(req.params.id);
    if (!job) { res.status(404).json({ message: "Not found." }); return; }
    res.json({ job });
  } catch (err) { console.error("[careers/adminGetJobById]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminCreateJob(req: Request, res: Response): Promise<void> {
  try {
    const result = await careersService.createJob(req.body);
    res.status(201).json({ ...result, message: "Job created." });
  } catch (err: any) {
    console.error("[careers/adminCreateJob]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminUpdateJob(req: Request, res: Response): Promise<void> {
  try {
    await careersService.updateJob(req.params.id, req.body);
    res.json({ message: "Job updated." });
  } catch (err: any) {
    console.error("[careers/adminUpdateJob]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminPatchJobStatus(req: Request, res: Response): Promise<void> {
  try {
    await careersService.patchJobStatus(req.params.id, req.body.status);
    res.json({ message: "Status updated." });
  } catch (err: any) {
    console.error("[careers/adminPatchJobStatus]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminDeleteJob(req: Request, res: Response): Promise<void> {
  try {
    await careersService.deleteJob(req.params.id);
    res.json({ message: "Job deleted." });
  } catch (err: any) {
    console.error("[careers/adminDeleteJob]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminGetApplications(req: Request, res: Response): Promise<void> {
  try {
    res.json(await careersService.getApplicationsByJobId(req.params.id));
  } catch (err: any) {
    console.error("[careers/adminGetApplications]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminUpdateApplication(req: Request, res: Response): Promise<void> {
  try {
    const { appId, status, notes } = req.body;
    await careersService.updateApplication(appId, status, notes);
    res.json({ message: "Application updated." });
  } catch (err: any) {
    console.error("[careers/adminUpdateApplication]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}