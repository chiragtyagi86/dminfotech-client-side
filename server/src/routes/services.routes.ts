import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as services from "../controllers/siteServices.controller";

export const servicesPublicRoutes = Router();
export const servicesAdminRoutes = Router();

// Public
servicesPublicRoutes.get("/", services.getServices);
servicesPublicRoutes.get("/:slug", services.getServiceBySlug);

// Admin
servicesAdminRoutes.get("/", requireAdmin, services.adminGetServices);
servicesAdminRoutes.post("/", requireAdmin, services.adminCreateService);
servicesAdminRoutes.get("/:slug", requireAdmin, services.adminGetServiceBySlug);
servicesAdminRoutes.put("/:slug", requireAdmin, services.adminUpdateService);
servicesAdminRoutes.delete("/:slug", requireAdmin, services.adminDeleteService);