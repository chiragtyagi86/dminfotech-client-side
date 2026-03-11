// src/controllers/testimonials.controller.ts

import { Request, Response } from "express";
import * as testimonialsService from "../services/testimonials.service";

// ── Public ────────────────────────────────────────────────────────────────────

export async function publicGetTestimonials(_req: Request, res: Response): Promise<void> {
  try {
    res.json(await testimonialsService.getAllTestimonials(""));
  } catch (err) {
    console.error("[testimonials/publicGetTestimonials]", err);
    res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
  }
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function adminGetTestimonials(req: Request, res: Response): Promise<void> {
  try {
    const search = req.query.search as string || "";
    res.json({ success: true, data: await testimonialsService.getAllTestimonials(search) });
  } catch (err) {
    console.error("[testimonials/adminGetTestimonials]", err);
    res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
  }
}
export async function adminGetTestimonialById(req: Request, res: Response): Promise<void> {
  try {
    const t = await testimonialsService.getTestimonialById(req.params.id);
    if (!t) { res.status(404).json({ success: false, message: "Testimonial not found" }); return; }
    res.json({ success: true, data: t });
  } catch (err) { console.error("[testimonials/adminGetTestimonialById]", err); res.status(500).json({ success: false, message: "Failed to fetch testimonial" }); }
}

export async function adminCreateTestimonial(req: Request, res: Response): Promise<void> {
  try {
    const result = await testimonialsService.createTestimonial(req.body);
    res.status(201).json({ success: true, message: "Testimonial created successfully", ...result });
  } catch (err: any) {
    console.error("[testimonials/adminCreateTestimonial]", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Failed to create testimonial" });
  }
}

export async function adminUpdateTestimonial(req: Request, res: Response): Promise<void> {
  try {
    const photoFile = req.file;
    await testimonialsService.updateTestimonial(req.params.id, req.body, photoFile);
    res.json({ success: true, message: "Testimonial updated successfully" });
  } catch (err: any) {
    console.error("[testimonials/adminUpdateTestimonial]", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Failed to update testimonial" });
  }
}

export async function adminDeleteTestimonial(req: Request, res: Response): Promise<void> {
  try {
    await testimonialsService.deleteTestimonial(req.params.id);
    res.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (err: any) {
    console.error("[testimonials/adminDeleteTestimonial]", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Failed to delete testimonial" });
  }
}

export async function adminToggleFeatured(req: Request, res: Response): Promise<void> {
  try {
    const result = await testimonialsService.toggleFeatured(req.params.id);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error("[testimonials/adminToggleFeatured]", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Failed to toggle featured" });
  }
}