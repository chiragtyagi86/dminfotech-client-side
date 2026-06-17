import { Router } from "express";
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

router.post("/auth/login", internPortal.login);
router.post("/auth/logout", internPortal.logout);
router.post("/auth/forgot-password", internPortal.forgotPassword);
router.post("/auth/reset-password", internPortal.resetPassword);
router.get("/auth/me", requireIntern, internPortal.me);
router.get("/dashboard", requireIntern, internPortal.dashboard);
router.put("/profile", requireIntern, internPortal.updateProfile);
router.post("/profile/photo", requireIntern, internImageUpload.single("file"), internPortal.uploadFile);
router.post("/files", requireIntern, internDocumentUpload.single("file"), internPortal.uploadFile);
router.post("/password", requireIntern, internPortal.changePassword);
router.post("/attendance/check-in", requireIntern, internPortal.checkIn);
router.post("/attendance/check-out", requireIntern, internPortal.checkOut);
router.post("/reports", requireIntern, internPortal.submitReport);
router.patch("/tasks/:id", requireIntern, internPortal.updateTask);

export default router;
