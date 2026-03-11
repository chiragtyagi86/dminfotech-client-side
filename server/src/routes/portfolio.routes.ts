// src/routes/portfolio.routes.ts
import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as portfolio from "../controllers/portfolio.controller";

const router = Router();
// Public
router.get("/",       portfolio.getPortfolioItems);
router.get("/:slug",  portfolio.getPortfolioItemBySlug);
// Admin
router.get   ("/",       requireAdmin, portfolio.adminGetPortfolio);
router.post  ("/",       requireAdmin, portfolio.adminCreatePortfolioItem);
router.get   ("/:slug",  requireAdmin, portfolio.adminGetPortfolioBySlug);
router.put   ("/:slug",  requireAdmin, portfolio.adminUpdatePortfolioItem);
router.delete("/:slug",  requireAdmin, portfolio.adminDeletePortfolioItem);
export default router;