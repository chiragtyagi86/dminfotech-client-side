// src/controllers/seo.controller.ts

import { Request, Response } from "express";
import * as seoService from "../services/seo.service";

// ── SEO ───────────────────────────────────────────────────────────────────────

export async function adminGetSeo(_req: Request, res: Response): Promise<void> {
  try { res.json(await seoService.getAdminSeo()); }
  catch (err) { console.error("[seo/adminGetSeo]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminUpdateGlobalSeo(req: Request, res: Response): Promise<void> {
  try {
    await seoService.updateGlobalSeo(req.body);
    res.json({ message: "Global SEO settings updated successfully" });
  } catch (err) { console.error("[seo/adminUpdateGlobalSeo]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminUpdateEntitySeo(req: Request, res: Response): Promise<void> {
  try {
    const { type, id } = req.params;
    await seoService.updateEntitySeo(type, id, req.body);
    res.json({ message: "SEO settings updated successfully", id });
  } catch (err: any) {
    console.error("[seo/adminUpdateEntitySeo]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function adminGetSettings(_req: Request, res: Response): Promise<void> {
  try { res.json({ data: await seoService.getAdminSettings() }); }
  catch (err) { console.error("[settings/adminGetSettings]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminUpdateSettings(req: Request, res: Response): Promise<void> {
  try {
    await seoService.updateAdminSettings(req.body);
    res.json({ message: "Site settings updated successfully" });
  } catch (err) { console.error("[settings/adminUpdateSettings]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminUploadMedia(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) { res.status(400).json({ message: "No file provided" }); return; }
    const mediaKey  = req.body.mediaKey;
    const filePath  = await seoService.uploadMedia(mediaKey, req.file);
    res.json({ message: "Media uploaded successfully", filePath, fileName: req.file.filename });
  } catch (err) { console.error("[settings/adminUploadMedia]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminDeleteMedia(req: Request, res: Response): Promise<void> {
  try {
    await seoService.deleteMedia(req.params.key);
    res.json({ message: "Media deleted successfully" });
  } catch (err: any) {
    console.error("[settings/adminDeleteMedia]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function adminGetDashboard(_req: Request, res: Response): Promise<void> {
  try { res.json({ data: await seoService.getDashboardStats() }); }
  catch (err) { console.error("[dashboard/adminGetDashboard]", err); res.status(500).json({ message: "Server error." }); }
}