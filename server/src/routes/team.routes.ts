// src/routes/team.routes.ts
//
// api.js expects:
//   GET /api/team        getTeamMembers (public)
//   GET /api/team/:id    getTeamMember  (public)

import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { teamUpload } from "../config/multer";
import * as team from "../controllers/team.controller";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/",    team.publicGetTeam);
router.get("/:id", team.publicGetTeamMember);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get   ("/",    requireAdmin, team.adminGetTeam);
router.post  ("/",    requireAdmin, team.adminCreateTeamMember);
router.get   ("/:id", requireAdmin, team.adminGetTeamMember);
router.put   ("/:id", requireAdmin,
  teamUpload.fields([{ name: "photo", maxCount: 1 }, { name: "signature", maxCount: 1 }]),
  team.adminUpdateTeamMember
);
router.delete("/:id", requireAdmin, team.adminDeleteTeamMember);

export default router;