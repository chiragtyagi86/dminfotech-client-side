import { Router } from "express";
import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { requireIntern } from "../middleware/internAuth";
import * as internPortal from "../controllers/internPortal.controller";
import getUploader from "../config/multer";

const router = Router();
const internImageUpload = getUploader("interns", "image", 5);
const internDocumentUpload = getUploader(
  "interns",
  [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  10
);
const privateDocumentDirectory = path.join(process.cwd(), "private-intern-documents");
fs.mkdirSync(privateDocumentDirectory, { recursive: true });
const privateDocumentUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, privateDocumentDirectory),
    filename: (_req, _file, callback) => callback(null, `${crypto.randomUUID()}.pdf`),
  }),
  fileFilter: (_req, file, callback) => {
    if (file.mimetype === "application/pdf" && path.extname(file.originalname).toLowerCase() === ".pdf") {
      callback(null, true);
      return;
    }
    callback(new Error("Only PDF documents are allowed."));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/auth/login", internPortal.login);
router.post("/auth/logout", internPortal.logout);
router.post("/auth/forgot-password", internPortal.forgotPassword);
router.post("/auth/reset-password", internPortal.resetPassword);
router.get("/verify-certificate", internPortal.verifyCertificate);
router.get("/auth/me", requireIntern, internPortal.me);
router.get("/dashboard", requireIntern, internPortal.dashboard);
router.get("/history/:type", requireIntern, internPortal.history);
router.get("/reports/:id/download", requireIntern, internPortal.downloadReport);
router.get("/certificates", requireIntern, internPortal.certificates);
router.get("/certificates/:certificateId/download", requireIntern, internPortal.downloadCertificate);
router.put("/profile", requireIntern, internPortal.updateProfile);
router.post("/profile/photo", requireIntern, internImageUpload.single("file"), internPortal.uploadFile);
router.post("/files", requireIntern, internDocumentUpload.single("file"), internPortal.uploadFile);
router.post("/profile/private-document", requireIntern, privateDocumentUpload.single("file"), internPortal.uploadPrivateDocument);
router.get("/profile/private-document/:type", requireIntern, internPortal.downloadPrivateDocument);
router.post("/password", requireIntern, internPortal.changePassword);
router.post("/attendance/check-in", requireIntern, internPortal.checkIn);
router.post("/attendance/check-out", requireIntern, internPortal.checkOut);
router.get("/attendance/calendar", requireIntern, internPortal.calendar);
router.post("/leaves", requireIntern, internPortal.requestLeave);
router.get("/leaves", requireIntern, internPortal.myLeaves);
router.post("/reports", requireIntern, internPortal.submitReport);
router.patch("/tasks/:id", requireIntern, internPortal.updateTask);

export default router;
