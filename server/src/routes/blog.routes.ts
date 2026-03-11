// src/routes/blog.routes.ts
//
// Public  → mounted at /api/blog/*        (from router/index.ts)
// Admin   → mounted at /api/admin/blog/*  (from router/index.ts)
//
// api.js expects:
//   GET /api/blog/posts             getAllPosts
//   GET /api/blog/posts/:slug       getPostBySlug
//   GET /api/blog/category/:slug    getPostsByCategory
//   GET /api/blog/categories        getAllCategories
//   GET /api/blog/category-counts   getCategoryPostCounts

import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as blog from "../controllers/blog.controller";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/posts",               blog.getAllPosts);
router.get("/posts/:slug",         blog.getPostBySlug);
router.get("/posts/:slug/related", blog.getRelatedPosts);
router.get("/category/:slug",      blog.getPostsByCategory);
router.get("/categories",          blog.getAllCategories);
router.get("/category-counts",     blog.getCategoryPostCounts);

// ── Admin (mounted at /api/admin/blog) ────────────────────────────────────────
router.get   ("/",       requireAdmin, blog.adminGetPosts);
router.post  ("/",       requireAdmin, blog.adminCreatePost);
router.get   ("/:slug",  requireAdmin, blog.adminGetPostBySlug);
router.put   ("/:slug",  requireAdmin, blog.adminUpdatePost);
router.delete("/:slug",  requireAdmin, blog.adminDeletePost);

export default router;