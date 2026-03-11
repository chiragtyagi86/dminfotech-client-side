// src/routes/settings.routes.ts
import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { settingsUpload } from "../config/multer";
import * as seo from "../controllers/seo.controller";

const router = Router();
router.get   ("/",            requireAdmin, seo.adminGetSettings);
router.put   ("/",            requireAdmin, seo.adminUpdateSettings);
router.post  ("/media",       requireAdmin, settingsUpload.single("file"), seo.adminUploadMedia);
router.delete("/media/:key",  requireAdmin, seo.adminDeleteMedia);
export default router;