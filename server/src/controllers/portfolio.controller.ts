// src/controllers/portfolio.controller.ts

import { Request, Response } from "express";
import * as portfolioService from "../services/portfolio.service";

export async function getPortfolioItems(_req: Request, res: Response): Promise<void> {
  try { res.json(await portfolioService.getAllPortfolioItems()); }
  catch (err) { console.error("[portfolio/getPortfolioItems]", err); res.status(500).json({ message: "Server error." }); }
}

export async function getPortfolioItemBySlug(req: Request, res: Response): Promise<void> {
  try {
    const item = await portfolioService.getPortfolioItemBySlug(req.params.slug);
    if (!item) { res.status(404).json({ message: "Project not found." }); return; }
    res.json(item);
  } catch (err) { console.error("[portfolio/getPortfolioItemBySlug]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminGetPortfolio(_req: Request, res: Response): Promise<void> {
  try { res.json(await portfolioService.getAdminPortfolio()); }
  catch (err) { console.error("[portfolio/adminGetPortfolio]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminGetPortfolioBySlug(req: Request, res: Response): Promise<void> {
  try { res.json(await portfolioService.getAdminPortfolioBySlug(req.params.slug)); }
  catch (err: any) { console.error("[portfolio/adminGetPortfolioBySlug]", err); res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}

export async function adminCreatePortfolioItem(req: Request, res: Response): Promise<void> {
  try {
    const result = await portfolioService.createPortfolioItem(req.body);
    res.status(201).json(result);
  } catch (err: any) { console.error("[portfolio/adminCreatePortfolioItem]", err); res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}

export async function adminUpdatePortfolioItem(req: Request, res: Response): Promise<void> {
  try {
    const result = await portfolioService.updatePortfolioItem(req.params.slug, req.body);
    res.json(result);
  } catch (err: any) { console.error("[portfolio/adminUpdatePortfolioItem]", err); res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}

export async function adminDeletePortfolioItem(req: Request, res: Response): Promise<void> {
  try {
    await portfolioService.deletePortfolioItem(req.params.slug);
    res.json({ success: true });
  } catch (err: any) { console.error("[portfolio/adminDeletePortfolioItem]", err); res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}