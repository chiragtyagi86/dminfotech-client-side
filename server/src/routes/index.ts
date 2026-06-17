// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./auth.routes";
import blogRoutes from "./blog.routes";
import careersRoutes from "./careers.routes";
import leadsRoutes from "./leads.routes";
import { teamPublicRoutes, teamAdminRoutes } from "./team.routes";
import testimonialsRoutes from "./testimonials.routes";
import { pagesPublicRoutes, pagesAdminRoutes } from "./pages.routes";
import { portfolioPublicRoutes, portfolioAdminRoutes } from "./portfolio.routes";
import { servicesPublicRoutes, servicesAdminRoutes } from "./services.routes";
import seoRoutes from "./seo.routes";
import {
  settingsPublicRoutes,
  settingsAdminRoutes
} from "./settings.routes";
import dashboardRoutes from "./dashboard.routes";
import internshipsRoutes from "./internships.routes";
import internPortalRoutes from "./internPortal.routes";

const router = Router();

// Public
router.use("/seo", seoRoutes);
router.use("/leads", leadsRoutes);
router.use("/blog", blogRoutes);
router.use("/careers", careersRoutes);
router.use("/portfolio", portfolioPublicRoutes);
router.use("/services",  servicesPublicRoutes);
router.use("/team", teamPublicRoutes);
router.use("/settings", settingsPublicRoutes);

router.use("/testimonials", testimonialsRoutes);
router.use("/pages", pagesPublicRoutes);
router.use("/intern", internPortalRoutes);

// Auth
router.use("/admin/auth", authRoutes);

// Admin
router.use("/admin/blog", blogRoutes);
router.use("/admin/careers", careersRoutes);
router.use("/admin/leads", leadsRoutes);
router.use("/admin/team", teamAdminRoutes);
router.use("/admin/testimonials", testimonialsRoutes);
router.use("/admin/pages", pagesAdminRoutes);
router.use("/admin/services", servicesAdminRoutes);
router.use("/admin/portfolio", portfolioAdminRoutes);
router.use("/admin/seo", seoRoutes);
router.use("/admin/settings", settingsAdminRoutes);
router.use("/admin/dashboard", dashboardRoutes);
router.use("/admin/internships", internshipsRoutes);

export default router;
