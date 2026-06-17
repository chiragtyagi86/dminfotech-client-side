// src/index.ts
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
import {
  frontendDistExists,
  getFrontendStaticPath,
  renderFrontendHtml,
} from "./services/frontendRenderer.service";

const app = express();
const PORT = process.env.PORT || 5000;
const frontendReady = frontendDistExists();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ── CORS — allow React frontend ───────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://dmifotech.com",
    credentials: true,
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: "Too many requests. Please try again later." },
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Cookie parsing ─────────────────────────────────────────────────────────────
app.use(cookieParser());

// ── Static files ──────────────────────────────────────────────────────────────
const uploadsPath = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsPath));

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api", router);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Frontend with server-side SEO meta injection ─────────────────────────────
app.use(
  express.static(getFrontendStaticPath(), {
    index: false,
    maxAge: "1y",
    immutable: true,
  })
);

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

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║     Dhanamitra Infotech — Express API Server       ║
║     Running on: http://api.dmifotech.com:${PORT}      ║
║     Environment: ${process.env.NODE_ENV ||
               "development"}                       ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});


export default app;
