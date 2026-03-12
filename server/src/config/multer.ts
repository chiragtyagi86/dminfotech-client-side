// // src/config/multer.ts
// // Reusable multer upload configurations for different upload types

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// function ensureDir(dir: string) {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// }

// // ── Resume uploads (PDF/Word) ──────────────────────────────────────────────
// const resumeStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     const dir = path.join(process.cwd(), "uploads/resumes");
//     ensureDir(dir);
//     cb(null, dir);
//   },
//   filename: (_req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
//   },
// });

// export const resumeUpload = multer({
//   storage: resumeStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (_req, file, cb) => {
//     const allowed = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];
//     if (allowed.includes(file.mimetype)) cb(null, true);
//     else cb(new Error("Resume must be a PDF or Word document."));
//   },
// });

// // ── Image uploads (settings, team, testimonials) ───────────────────────────
// function imageStorage(subDir: string) {
//   return multer.diskStorage({
//     destination: (_req, _file, cb) => {
//       const dir = path.join(process.cwd(), `uploads/${subDir}`);
//       ensureDir(dir);
//       cb(null, dir);
//     },
//     filename: (_req, file, cb) => {
//       const ext = path.extname(file.originalname);
//       cb(null, `${subDir}-${Date.now()}${ext}`);
//     },
//   });
// }

// const imageFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
//   const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Invalid file type. Only images are allowed."));
// };

// export const settingsUpload = multer({
//   storage: imageStorage("settings"),
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFilter,
// });

// export const teamUpload = multer({
//   storage: imageStorage("team"),
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFilter,
// });

// export const testimonialUpload = multer({
//   storage: imageStorage("testimonials"),
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFilter,
// });

// src/config/multer.ts
// ─────────────────────────────────────────────────────────────
// Reusable multer uploader
// Supports images, pdfs, custom mime arrays and any file type
// Automatically creates upload folders
// ─────────────────────────────────────────────────────────────

import multer from "multer";
import path from "path";
import fs from "fs";

type UploadType = "image" | "pdf" | "any" | string[];

/**
 * Creates a configured multer uploader
 *
 * @param folder     uploads subfolder (e.g. portfolio, team)
 * @param type       allowed file type ("image" | "pdf" | "any" | custom mime[])
 * @param maxSizeMB  max file size in MB
 */
function getUploader(folder = "", type: UploadType = "image", maxSizeMB = 5) {
  const uploadDir = path.join(process.cwd(), "uploads", folder);

  // Ensure folder exists
  fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },

    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();

      const baseName = path
        .basename(file.originalname, ext)
        .replace(/[^a-z0-9_-]/gi, "_");

      const uniqueName = `${Date.now()}-${baseName}${ext}`;

      cb(null, uniqueName);
    },
  });

  const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const mime = file.mimetype;
    const ext = path.extname(file.originalname).toLowerCase();

    // Custom mime array
    if (Array.isArray(type)) {
      if (type.includes(mime)) return cb(null, true);
      return cb(new Error(`Only files of type ${type.join(", ")} are allowed.`));
    }

    // Image upload
    if (type === "image") {
      const allowedImages = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
        "image/gif",
        "image/svg+xml",
      ];

      if (allowedImages.includes(mime)) return cb(null, true);

      return cb(new Error("Only image files are allowed."));
    }

    // PDF upload
    if (type === "pdf") {
      if (mime === "application/pdf" && ext === ".pdf") return cb(null, true);

      return cb(new Error("Only PDF files are allowed."));
    }

    // Any file
    return cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
    },
  });
}

export default getUploader;


// ─────────────────────────────────────────────────────────────
// Pre-configured uploaders used across the project
// ─────────────────────────────────────────────────────────────

export const portfolioUpload   = getUploader("portfolio", "image", 5);
export const teamUpload        = getUploader("team", "image", 5);
export const testimonialUpload = getUploader("testimonials", "image", 5);
export const settingsUpload    = getUploader("settings", "image", 5);

export const resumeUpload = getUploader(
  "resumes",
  [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  5
);