// src/routes/settings.routes.ts
import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { settingsUpload } from "../config/multer";
import * as seo from "../controllers/seo.controller";

export const settingsPublicRoutes = Router();
export const settingsAdminRoutes = Router();


// ─────────────────────────────────────────
// PUBLIC ROUTES
// mounted at: /api/settings
// ─────────────────────────────────────────

settingsPublicRoutes.get("/public", seo.publicGetSettings);


// ─────────────────────────────────────────
// ADMIN ROUTES
// mounted at: /api/admin/settings
// ─────────────────────────────────────────

settingsAdminRoutes.get("/", requireAdmin, seo.adminGetSettings);

settingsAdminRoutes.put("/", requireAdmin, seo.adminUpdateSettings);

settingsAdminRoutes.post(
  "/media",
  requireAdmin,
  settingsUpload.single("file"),
  seo.adminUploadMedia
);

settingsAdminRoutes.delete(
  "/media/:key",
  requireAdmin,
  seo.adminDeleteMedia
);