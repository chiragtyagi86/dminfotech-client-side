// src/routes/pages.routes.ts
//
// api.js expects:
//   GET /api/pages/:slug   getPage (public)

import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as pages from "../controllers/pages.controller";

export const pagesPublicRoutes = Router();
export const pagesAdminRoutes = Router();

// ── Public ────────────────────────────────────────────────────────────────────
pagesPublicRoutes.get("/", pages.publicGetPages);
pagesPublicRoutes.get("/:slug", pages.publicGetPage);

// ── Admin ─────────────────────────────────────────────────────────────────────
pagesAdminRoutes.get   ("/",        requireAdmin, pages.adminGetPages);
pagesAdminRoutes.post  ("/",        requireAdmin, pages.adminCreatePage);
pagesAdminRoutes.get   ("/:slug",   requireAdmin, pages.adminGetPageBySlug);
pagesAdminRoutes.put   ("/:slug",   requireAdmin, pages.adminUpdatePage);
pagesAdminRoutes.delete("/:slug", requireAdmin, pages.adminDeletePage);
