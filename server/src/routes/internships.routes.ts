import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as internships from "../controllers/internships.controller";

const router = Router();

router.use(requireAdmin);

router.get("/", internships.getOverview);
router.post("/interns", internships.createIntern);
router.put("/interns/:id", internships.updateIntern);
router.delete("/interns/:id", internships.deleteIntern);
router.post("/attendance", internships.createAttendance);
router.post("/reports", internships.createReport);
router.patch("/reports/:id/review", internships.reviewReport);
router.post("/tasks", internships.createTask);
router.patch("/tasks/:id", internships.updateTask);

export default router;
