// src/routes/dashboard.routes.ts
import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { adminGetDashboard } from "../controllers/seo.controller";

const router = Router();
router.get("/", requireAdmin, adminGetDashboard);
export default router;