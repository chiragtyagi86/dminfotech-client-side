// src/routes/pages.routes.ts
//
// api.js expects:
//   GET /api/pages/:slug   getPage (public)

import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as pages from "../controllers/pages.controller";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/:slug", pages.publicGetPage);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get   ("/",        requireAdmin, pages.adminGetPages);
router.post  ("/",        requireAdmin, pages.adminCreatePage);
router.get   ("/:slug",   requireAdmin, pages.adminGetPageBySlug);
router.put   ("/:slug",   requireAdmin, pages.adminUpdatePage);
router.delete("/:slug",   requireAdmin, pages.adminDeletePage);

export default router;