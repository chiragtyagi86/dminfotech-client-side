// src/controllers/pages.controller.ts

import { Request, Response } from "express";
import * as pagesService from "../services/pages.service";

// ── Public ────────────────────────────────────────────────────────────────────

export async function publicGetPage(req: Request, res: Response): Promise<void> {
  try {
    const page = await pagesService.getPageBySlug(req.params.slug);
    res.json(page);
  } catch (err: any) {
    console.error("[pages/publicGetPage]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}
// ── Admin ─────────────────────────────────────────────────────────────────────

export async function adminGetPages(req: Request, res: Response): Promise<void> {
  try {
    const page   = parseInt(req.query.page as string || "1");
    const limit  = parseInt(req.query.limit as string || "20");
    const search = req.query.search as string || "";

    res.json(await pagesService.getAdminPages(page, limit, search));
  } catch (err) {
    console.error("[pages/adminGetPages]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function adminGetPageBySlug(req: Request, res: Response): Promise<void> {
  try {
    res.json({ data: await pagesService.getPageBySlug(req.params.slug) });
  } catch (err: any) {
    console.error("[pages/adminGetPageBySlug]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminCreatePage(req: Request, res: Response): Promise<void> {
  try {
    const result = await pagesService.createPage(req.body);
    res.status(201).json({ message: "Page created successfully", ...result });
  } catch (err: any) {
    console.error("[pages/adminCreatePage]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminUpdatePage(req: Request, res: Response): Promise<void> {
  try {
    await pagesService.updatePage(req.params.slug, req.body);
    res.json({ message: "Page updated successfully", slug: req.params.slug });
  } catch (err: any) {
    console.error("[pages/adminUpdatePage]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminDeletePage(req: Request, res: Response): Promise<void> {
  try {
    await pagesService.deletePage(req.params.slug);
    res.json({ message: "Page deleted successfully", slug: req.params.slug });
  } catch (err: any) {
    console.error("[pages/adminDeletePage]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}