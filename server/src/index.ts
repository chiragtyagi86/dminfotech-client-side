// src/index.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

import router from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";
import {
  frontendDistExists,
  getFrontendStaticPath,
  renderFrontendHtml,
} from "./services/frontendRenderer.service";

const app = express();
const PORT = process.env.PORT || 5000;
const frontendReady = frontendDistExists();

app.set("trust proxy", 1);

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Force HTTPS for 1 year (incl. subdomains) — SEO/security best practice.
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://dmifotech.com",
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookies
app.use(cookieParser());

// Health check - no rate limit
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// IMPORTANT: Force root "/" to render Home SEO before static middleware
app.get("/", async (_req, res, next) => {
  try {
    const hasFrontend = await frontendReady;

    if (!hasFrontend) {
      res.status(404).json({ message: "Frontend build not found." });
      return;
    }

    const html = await renderFrontendHtml("/home");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    res.send(html);
  } catch (err) {
    next(err);
  }
});

// Uploads - no rate limit
const uploadsPath = path.join(process.cwd(), "uploads");

app.use(
  "/uploads",
  express.static(uploadsPath, {
    fallthrough: false,
    maxAge: "30d",
  })
);

// Optional debug route
app.get("/debug/uploads", (_req, res) => {
  res.json({
    cwd: process.cwd(),
    uploadsPath,
    uploadsExists: fs.existsSync(uploadsPath),
  });
});

// Frontend static assets - no rate limit
app.use(
  express.static(getFrontendStaticPath(), {
    index: false,
    maxAge: "1y",
    immutable: true,
  })
);

// API rate limiter - only /api
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many API requests. Please try again later." },
});

app.use("/api", apiLimiter, router);

// Frontend SEO fallback - last
app.get("*", async (req, res, next) => {
  try {
    const hasFrontend = await frontendReady;

    if (!hasFrontend) {
      res.status(404).json({ message: "Route not found." });
      return;
    }

    const html = await renderFrontendHtml(req.path);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    res.send(html);
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║     Dhanamitra Infotech — Express API Server       ║
║     Running on port: ${PORT}
║     Environment: ${process.env.NODE_ENV || "development"}
║     Uploads: ${uploadsPath}
╚════════════════════════════════════════════════════╝
  `);
});

export default app;