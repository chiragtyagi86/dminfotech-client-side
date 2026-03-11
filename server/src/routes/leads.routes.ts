// src/routes/leads.routes.ts
//
// api.js expects:
//   POST /api/leads        submitLead (public contact form)
//
// Admin:
//   GET    /api/admin/leads
//   GET    /api/admin/leads/:id
//   PUT    /api/admin/leads/:id
//   DELETE /api/admin/leads/:id

import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as leads from "../controllers/leads.controller";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.post("/", leads.contactForm);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get   ("/",    requireAdmin, leads.adminGetLeads);
router.get   ("/:id", requireAdmin, leads.adminGetLeadById);
router.put   ("/:id", requireAdmin, leads.adminUpdateLead);
router.delete("/:id", requireAdmin, leads.adminDeleteLead);

export default router;