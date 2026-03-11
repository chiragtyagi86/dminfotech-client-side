// src/routes/services.routes.ts
import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as svc from "../controllers/siteServices.controller";

const router = Router();
// Public
router.get("/",       svc.getServices);
router.get("/:slug",  svc.getServiceBySlug);
// Admin
router.get   ("/",       requireAdmin, svc.adminGetServices);
router.post  ("/",       requireAdmin, svc.adminCreateService);
router.get   ("/:slug",  requireAdmin, svc.adminGetServiceBySlug);
router.put   ("/:slug",  requireAdmin, svc.adminUpdateService);
router.delete("/:slug",  requireAdmin, svc.adminDeleteService);
export default router;