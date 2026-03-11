// src/controllers/team.controller.ts

import { Request, Response } from "express";
import * as teamService from "../services/team.service";

// ── Public ────────────────────────────────────────────────────────────────────

export async function publicGetTeam(_req: Request, res: Response): Promise<void> {
  try {
    res.json(await teamService.getAllTeam(""));
  } catch (err) {
    console.error("[team/publicGetTeam]", err);
    res.status(500).json({ success: false, message: "Failed to fetch team members" });
  }
}

export async function publicGetTeamMember(req: Request, res: Response): Promise<void> {
  try {
    const member = await teamService.getTeamMemberById(req.params.id);
    if (!member) { res.status(404).json({ success: false, message: "Team member not found" }); return; }
    res.json(member);
  } catch (err) {
    console.error("[team/publicGetTeamMember]", err);
    res.status(500).json({ success: false, message: "Failed to fetch team member" });
  }
}
// ── Admin ─────────────────────────────────────────────────────────────────────

export async function adminGetTeam(req: Request, res: Response): Promise<void> {
  try {
    const search = req.query.search as string || "";
    res.json({ success: true, data: await teamService.getAllTeam(search) });
  } catch (err) {
    console.error("[team/adminGetTeam]", err);
    res.status(500).json({ success: false, message: "Failed to fetch team members" });
  }
}

export async function adminGetTeamMember(req: Request, res: Response): Promise<void> {
  try {
    const member = await teamService.getTeamMemberById(req.params.id);
    if (!member) { res.status(404).json({ success: false, message: "Team member not found" }); return; }
    res.json({ success: true, data: member });
  } catch (err) { console.error("[team/adminGetTeamMember]", err); res.status(500).json({ success: false, message: "Failed to fetch team member" }); }
}

export async function adminCreateTeamMember(req: Request, res: Response): Promise<void> {
  try {
    const result = await teamService.createTeamMember(req.body);
    res.status(201).json({ success: true, message: "Team member created successfully", ...result });
  } catch (err: any) {
    console.error("[team/adminCreateTeamMember]", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Failed to create team member" });
  }
}

export async function adminUpdateTeamMember(req: Request, res: Response): Promise<void> {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const photoFile     = files?.photo?.[0];
    const signatureFile = files?.signature?.[0];
    await teamService.updateTeamMember(req.params.id, req.body, photoFile, signatureFile);
    res.json({ success: true, message: "Team member updated successfully" });
  } catch (err: any) {
    console.error("[team/adminUpdateTeamMember]", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Failed to update team member" });
  }
}

export async function adminDeleteTeamMember(req: Request, res: Response): Promise<void> {
  try {
    await teamService.deleteTeamMember(req.params.id);
    res.json({ success: true, message: "Team member deleted successfully" });
  } catch (err: any) {
    console.error("[team/adminDeleteTeamMember]", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Failed to delete team member" });
  }
}