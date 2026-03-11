// src/config/multer.ts
// Reusable multer upload configurations for different upload types

import multer from "multer";
import path from "path";
import fs from "fs";

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Resume uploads (PDF/Word) ──────────────────────────────────────────────
const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), "uploads/resumes");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

export const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Resume must be a PDF or Word document."));
  },
});

// ── Image uploads (settings, team, testimonials) ───────────────────────────
function imageStorage(subDir: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path.join(process.cwd(), `uploads/${subDir}`);
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${subDir}-${Date.now()}${ext}`);
    },
  });
}

const imageFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only images are allowed."));
};

export const settingsUpload = multer({
  storage: imageStorage("settings"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

export const teamUpload = multer({
  storage: imageStorage("team"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

export const testimonialUpload = multer({
  storage: imageStorage("testimonials"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});