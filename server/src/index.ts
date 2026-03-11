// src/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Dhanamitra Infotech LLP — Express.js Backend Server
// Converted from Next.js API Routes → Express Router/Controller/Service pattern
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

import router from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — allow React frontend ───────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,               // needed for httpOnly cookie auth
}));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,       // 15 minutes
  max:      200,
  message:  { message: "Too many requests. Please try again later." },
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Cookie parsing (for JWT auth cookie) ──────────────────────────────────────
app.use(cookieParser());

// ── Static files (uploaded resumes, images, etc.) ────────────────────────────
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api", router);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║     Dhanamitra Infotech — Express API Server       ║
║     Running on: http://localhost:${PORT}              ║
║     Environment: ${process.env.NODE_ENV || "development"}                    ║
╚════════════════════════════════════════════════════╝
  `);
});

export default app;