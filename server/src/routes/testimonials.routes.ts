// src/routes/testimonials.routes.ts
//
// api.js expects:
//   GET /api/testimonials   getTestimonials (public)

import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { testimonialUpload } from "../config/multer";
import * as testimonials from "../controllers/testimonials.controller";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", testimonials.publicGetTestimonials);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get   ("/",                    requireAdmin, testimonials.adminGetTestimonials);
router.post  ("/",                    requireAdmin, testimonials.adminCreateTestimonial);
router.get   ("/:id",                 requireAdmin, testimonials.adminGetTestimonialById);
router.put   ("/:id",                 requireAdmin, testimonialUpload.single("photo"), testimonials.adminUpdateTestimonial);
router.delete("/:id",                 requireAdmin, testimonials.adminDeleteTestimonial);
router.put   ("/:id/toggle-featured", requireAdmin, testimonials.adminToggleFeatured);

export default router;