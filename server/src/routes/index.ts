// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./auth.routes";
import blogRoutes from "./blog.routes";
import careersRoutes from "./careers.routes";
import leadsRoutes from "./leads.routes";
import { teamPublicRoutes, teamAdminRoutes } from "./team.routes";import testimonialsRoutes from "./testimonials.routes";
import pagesRoutes from "./pages.routes";
import { portfolioPublicRoutes, portfolioAdminRoutes } from "./portfolio.routes";
import { servicesPublicRoutes, servicesAdminRoutes } from "./services.routes";import seoRoutes from "./seo.routes";
import {
  settingsPublicRoutes,
  settingsAdminRoutes
} from "./settings.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

// Public
router.use("/leads", leadsRoutes);
router.use("/blog", blogRoutes);
router.use("/careers", careersRoutes);
router.use("/portfolio", portfolioPublicRoutes);
router.use("/services",  servicesPublicRoutes);
router.use("/team", teamPublicRoutes);
router.use("/settings", settingsPublicRoutes);

router.use("/testimonials", testimonialsRoutes);
router.use("/pages", pagesRoutes);

// Auth
router.use("/admin/auth", authRoutes);

// Admin
router.use("/admin/blog", blogRoutes);
router.use("/admin/careers", careersRoutes);
router.use("/admin/leads", leadsRoutes);
router.use("/admin/team", teamAdminRoutes);
router.use("/admin/testimonials", testimonialsRoutes);
router.use("/admin/pages", pagesRoutes);
router.use("/admin/services", servicesAdminRoutes);
router.use("/admin/portfolio", portfolioAdminRoutes);
router.use("/admin/seo", seoRoutes);
router.use("/admin/settings", settingsAdminRoutes);
router.use("/admin/dashboard", dashboardRoutes);

export default router;