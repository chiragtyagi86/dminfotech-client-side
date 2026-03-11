// src/routes/careers.routes.ts
//
// api.js expects:
//   GET  /api/careers/jobs          getAllOpenJobs
//   GET  /api/careers/jobs/:slug    getJobBySlug
//   POST /api/careers/apply         submitApplication

import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { resumeUpload } from "../config/multer";
import * as careers from "../controllers/careers.controller";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get  ("/jobs",       careers.getAllOpenJobs);
router.get  ("/jobs/:slug", careers.getJobBySlug);
router.post ("/apply",      resumeUpload.single("resume"), careers.submitApplication);

// ── Admin (mounted at /api/admin/careers) ─────────────────────────────────────
router.get   ("/",                    requireAdmin, careers.adminGetJobs);
router.post  ("/",                    requireAdmin, careers.adminCreateJob);
router.get   ("/:id",                 requireAdmin, careers.adminGetJobById);
router.put   ("/:id",                 requireAdmin, careers.adminUpdateJob);
router.patch ("/:id",                 requireAdmin, careers.adminPatchJobStatus);
router.delete("/:id",                 requireAdmin, careers.adminDeleteJob);
router.get   ("/:id/applications",    requireAdmin, careers.adminGetApplications);
router.patch ("/:id/applications",    requireAdmin, careers.adminUpdateApplication);

export default router;