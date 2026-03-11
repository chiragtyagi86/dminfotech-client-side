// src/controllers/siteServices.controller.ts

import { Request, Response } from "express";
import * as siteServicesService from "../services/siteServices.service";

export async function getServices(_req: Request, res: Response): Promise<void> {
  try { res.json(await siteServicesService.getAllServices()); }
  catch (err) { console.error("[services/getServices]", err); res.status(500).json({ message: "Server error." }); }
}

export async function getServiceBySlug(req: Request, res: Response): Promise<void> {
  try {
    const svc = await siteServicesService.getServiceBySlug(req.params.slug);
    if (!svc) { res.status(404).json({ message: "Service not found." }); return; }
    res.json(svc);
  } catch (err) { console.error("[services/getServiceBySlug]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminGetServices(_req: Request, res: Response): Promise<void> {
  try { res.json(await siteServicesService.getAdminServices()); }
  catch (err) { console.error("[services/adminGetServices]", err); res.status(500).json({ message: "Server error." }); }
}

export async function adminGetServiceBySlug(req: Request, res: Response): Promise<void> {
  try { res.json(await siteServicesService.getAdminServiceBySlug(req.params.slug)); }
  catch (err: any) { console.error("[services/adminGetServiceBySlug]", err); res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}

export async function adminCreateService(req: Request, res: Response): Promise<void> {
  try {
    const result = await siteServicesService.createService(req.body);
    res.status(201).json(result);
  } catch (err: any) { console.error("[services/adminCreateService]", err); res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}

export async function adminUpdateService(req: Request, res: Response): Promise<void> {
  try {
    const result = await siteServicesService.updateService(req.params.slug, req.body);
    res.json(result);
  } catch (err: any) { console.error("[services/adminUpdateService]", err); res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}

export async function adminDeleteService(req: Request, res: Response): Promise<void> {
  try {
    await siteServicesService.deleteService(req.params.slug);
    res.json({ success: true });
  } catch (err: any) { console.error("[services/adminDeleteService]", err); res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}