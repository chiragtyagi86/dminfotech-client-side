// src/routes/portfolio.routes.ts
import { Router, Request, Response } from "express";
import { requireAdmin } from "../middleware/auth";
import * as portfolio from "../controllers/portfolio.controller";
import { portfolioUpload } from "../config/multer";

export const portfolioPublicRoutes = Router();
export const portfolioAdminRoutes = Router();


// ─────────────────────────────────────────
// PUBLIC ROUTES
// mounted at: /api/portfolio
// ─────────────────────────────────────────

portfolioPublicRoutes.get("/", portfolio.getPortfolioItems);
portfolioPublicRoutes.get("/:slug", portfolio.getPortfolioItemBySlug);


// ─────────────────────────────────────────
// ADMIN ROUTES
// mounted at: /api/admin/portfolio
// ─────────────────────────────────────────

// upload route MUST come before "/:slug"
portfolioAdminRoutes.post(
  "/upload",
  requireAdmin,
  portfolioUpload.single("image"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No image uploaded." });
        return;
      }

      res.json({
        image: `/uploads/portfolio/${req.file.filename}`,
      });
    } catch (err: any) {
      console.error("[portfolio upload]", err);
      res.status(500).json({ message: err.message || "Upload failed." });
    }
  }
);

portfolioAdminRoutes.get("/", requireAdmin, portfolio.adminGetPortfolio);
portfolioAdminRoutes.post("/", requireAdmin, portfolio.adminCreatePortfolioItem);
portfolioAdminRoutes.get("/:slug", requireAdmin, portfolio.adminGetPortfolioBySlug);
portfolioAdminRoutes.put("/:slug", requireAdmin, portfolio.adminUpdatePortfolioItem);
portfolioAdminRoutes.delete("/:slug", requireAdmin, portfolio.adminDeletePortfolioItem);