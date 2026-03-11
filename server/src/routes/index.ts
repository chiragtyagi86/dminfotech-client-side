// src/routes/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Main router — mounts all sub-routers
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from "express";
import authRoutes         from "./auth.routes";
import blogRoutes         from "./blog.routes";
import careersRoutes      from "./careers.routes";
import leadsRoutes        from "./leads.routes";
import teamRoutes         from "./team.routes";
import testimonialsRoutes from "./testimonials.routes";
import pagesRoutes        from "./pages.routes";
import portfolioRoutes    from "./portfolio.routes";
import servicesRoutes     from "./services.routes";
import seoRoutes          from "./seo.routes";
import settingsRoutes     from "./settings.routes";
import dashboardRoutes    from "./dashboard.routes";

const router = Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.use("/leads",   leadsRoutes);
router.use("/blog",      blogRoutes);
router.use("/careers",   careersRoutes);
router.use("/services",  servicesRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/team",      teamRoutes);
router.use("/testimonials", testimonialsRoutes);
router.use("/pages",     pagesRoutes);

// ── Auth routes ───────────────────────────────────────────────────────────────
router.use("/admin/auth", authRoutes);

// ── Admin routes (protected) ──────────────────────────────────────────────────
router.use("/admin/blog",         blogRoutes);
router.use("/admin/careers",      careersRoutes);
router.use("/admin/leads",        leadsRoutes);
router.use("/admin/team",         teamRoutes);
router.use("/admin/testimonials", testimonialsRoutes);
router.use("/admin/pages",        pagesRoutes);
router.use("/admin/portfolio",    portfolioRoutes);
router.use("/admin/services",     servicesRoutes);
router.use("/admin/seo",          seoRoutes);
router.use("/admin/settings",     settingsRoutes);
router.use("/admin/dashboard",    dashboardRoutes);

export default router;