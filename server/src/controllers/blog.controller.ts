// src/controllers/blog.controller.ts

import { Request, Response } from "express";
import * as blogService from "../services/blog.service";

// ── Public ────────────────────────────────────────────────────────────────────

export async function getPostsByCategory(req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await (await import("../config/db")).default.query(
      `SELECT bp.*, bc.name AS category_name, bc.slug AS category_slug,
              bc.color AS category_color, bc.icon AS category_icon
       FROM blog_posts bp
       LEFT JOIN blog_categories bc ON bc.id = bp.category_id
       WHERE bp.status = 'published' AND bc.slug = ?
       ORDER BY bp.published_at DESC`,
      [req.params.slug]
    );
    res.json(rows);
  } catch (err) {
    console.error("[blog/getPostsByCategory]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function getAllPosts(req: Request, res: Response): Promise<void> {
  try {
    res.json(await blogService.getAllPosts());
  } catch (err) {
    console.error("[blog/getAllPosts]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function getPostBySlug(req: Request, res: Response): Promise<void> {
  try {
    const post = await blogService.getPostBySlug(req.params.slug);
    if (!post) { res.status(404).json({ message: "Post not found." }); return; }
    res.json(post);
  } catch (err) {
    console.error("[blog/getPostBySlug]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function getRelatedPosts(req: Request, res: Response): Promise<void> {
  try {
    const post = await blogService.getPostBySlug(req.params.slug);
    if (!post) { res.status(404).json({ message: "Post not found." }); return; }
    res.json(await blogService.getRelatedPosts(post));
  } catch (err) {
    console.error("[blog/getRelatedPosts]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function getAllCategories(_req: Request, res: Response): Promise<void> {
  try {
    res.json(await blogService.getAllCategories());
  } catch (err) {
    console.error("[blog/getAllCategories]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function getCategoryPostCounts(_req: Request, res: Response): Promise<void> {
  try {
    res.json(await blogService.getCategoryPostCounts());
  } catch (err) {
    console.error("[blog/getCategoryPostCounts]", err);
    res.status(500).json({ message: "Server error." });
  }
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function adminGetPosts(req: Request, res: Response): Promise<void> {
  try {
    const page   = parseInt(req.query.page   as string || "1");
    const limit  = parseInt(req.query.limit  as string || "20");
    const search = req.query.search as string || "";
    const status = req.query.status as string || "";
    res.json(await blogService.getAdminPosts(page, limit, search, status));
  } catch (err) {
    console.error("[blog/adminGetPosts]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function adminGetPostBySlug(req: Request, res: Response): Promise<void> {
  try {
    const post = await blogService.getAdminPostBySlug(req.params.slug);
    if (!post) { res.status(404).json({ message: "Post not found." }); return; }
    res.json(post);
  } catch (err) {
    console.error("[blog/adminGetPostBySlug]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function adminCreatePost(req: Request, res: Response): Promise<void> {
  try {
    const result = await blogService.createPost(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    console.error("[blog/adminCreatePost]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminUpdatePost(req: Request, res: Response): Promise<void> {
  try {
    const result = await blogService.updatePost(req.params.slug, req.body);
    res.json(result);
  } catch (err: any) {
    console.error("[blog/adminUpdatePost]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function adminDeletePost(req: Request, res: Response): Promise<void> {
  try {
    await blogService.deletePost(req.params.slug);
    res.json({ success: true });
  } catch (err: any) {
    console.error("[blog/adminDeletePost]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}