// src/routes/seo.routes.ts
import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as seo from "../controllers/seo.controller";

const router = Router();
router.get("/",              requireAdmin, seo.adminGetSeo);
router.put("/",              requireAdmin, seo.adminUpdateGlobalSeo);
router.put("/:type/:id",     requireAdmin, seo.adminUpdateEntitySeo);
export default router;