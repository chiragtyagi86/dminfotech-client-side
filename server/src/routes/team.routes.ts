import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { teamUpload } from "../config/multer";
import * as team from "../controllers/team.controller";

export const teamPublicRoutes = Router();
export const teamAdminRoutes = Router();

// Public
teamPublicRoutes.get("/", team.publicGetTeam);
teamPublicRoutes.get("/:id", team.publicGetTeamMember);

// Admin
teamAdminRoutes.get("/", requireAdmin, team.adminGetTeam);

teamAdminRoutes.post(
  "/",
  requireAdmin,
  teamUpload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  team.adminCreateTeamMember
);

teamAdminRoutes.get("/:id", requireAdmin, team.adminGetTeamMember);

teamAdminRoutes.put(
  "/:id",
  requireAdmin,
  teamUpload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  team.adminUpdateTeamMember
);

teamAdminRoutes.delete("/:id", requireAdmin, team.adminDeleteTeamMember);