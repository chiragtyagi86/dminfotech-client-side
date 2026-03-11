// src/controllers/leads.controller.ts

import { Request, Response } from "express";
import * as leadsService from "../services/leads.service";

export async function contactForm(req: Request, res: Response): Promise<void> {
  try {
    const sourcePage = req.headers["referer"] || "";
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0].trim()
              || req.headers["x-real-ip"]?.toString() || req.ip || "";
    const result = await leadsService.createLead(req.body, sourcePage as string, ip);
    res.status(201).json({ success: true, message: "Thank you! We will be in touch soon.", ...result });
  } catch (err: any) {
    console.error("[leads/contactForm]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminGetLeads(req: Request, res: Response): Promise<void> {
  try {
    const page   = parseInt(req.query.page   as string || "1");
    const limit  = parseInt(req.query.limit  as string || "30");
    const status = req.query.status as string || "";
    const search = req.query.search as string || "";
    res.json(await leadsService.getAdminLeads(page, limit, status, search));
  } catch (err) { console.error("[leads/adminGetLeads]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminGetLeadById(req: Request, res: Response): Promise<void> {
  try {
    res.json({ data: await leadsService.getLeadById(req.params.id) });
  } catch (err: any) {
    console.error("[leads/adminGetLeadById]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminUpdateLead(req: Request, res: Response): Promise<void> {
  try {
    await leadsService.updateLeadStatus(req.params.id, req.body.status);
    res.json({ message: "Lead updated successfully", id: req.params.id });
  } catch (err: any) {
    console.error("[leads/adminUpdateLead]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminDeleteLead(req: Request, res: Response): Promise<void> {
  try {
    await leadsService.deleteLead(req.params.id);
    res.json({ message: "Lead deleted successfully", id: req.params.id });
  } catch (err: any) {
    console.error("[leads/adminDeleteLead]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}