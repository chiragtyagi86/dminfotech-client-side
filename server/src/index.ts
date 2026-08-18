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

const allowedOrigins = new Set([
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5175",
]);

// CORS
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin is not allowed by CORS."));
    },
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

// Auth rate limiter - only login/auth routes, to slow down brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/admin/auth", authLimiter);
app.use("/api/intern/auth", authLimiter);

app.use("/api", router);

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

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║     Dhanamitra Infotech — Express API Server       ║
║     Running on port: ${PORT}
║     Environment: ${process.env.NODE_ENV || "development"}
║     Uploads: ${uploadsPath}
╚════════════════════════════════════════════════════╝
  `);

  console.log(
    JSON.stringify({
      event: "APPLICATION_START",
      pid: process.pid,
      ppid: process.ppid,
      nodeVersion: process.version,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  );
});

// Diagnostics: makes it possible to see *when* and *why* a new lsnode
// worker starts, without masking recoverable errors by exiting the process.
function logProcessEvent(event: string, extra: Record<string, unknown> = {}) {
  console.log(
    JSON.stringify({
      event,
      pid: process.pid,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      ...extra,
    })
  );
}

process.on("uncaughtException", (err) => {
  logProcessEvent("UNCAUGHT_EXCEPTION", { message: err.message, stack: err.stack });
});

process.on("unhandledRejection", (reason) => {
  logProcessEvent("UNHANDLED_REJECTION", {
    message: reason instanceof Error ? reason.message : String(reason),
  });
});

let shuttingDown = false;
function gracefulShutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  logProcessEvent("SHUTDOWN_SIGNAL", { signal });

  server.close(() => {
    logProcessEvent("SHUTDOWN_COMPLETE", { signal });
    process.exit(0);
  });

  // Safety net: force-exit if connections don't drain in time (e.g. Passenger
  // rolling restart waiting on this worker).
  setTimeout(() => {
    logProcessEvent("SHUTDOWN_FORCED", { signal });
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
