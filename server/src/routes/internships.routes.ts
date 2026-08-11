import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import * as internships from "../controllers/internships.controller";

const router = Router();

router.use(requireAdmin);

router.get("/", internships.getOverview);
router.post("/interns", internships.createIntern);
router.put("/interns/:id", internships.updateIntern);
router.delete("/interns/:id", internships.deleteIntern);
router.get("/interns/:id/documents/:type", internships.downloadInternDocument);
router.get("/certificate-settings", internships.getCertificateSettings);
router.put("/certificate-settings", internships.updateCertificateSettings);
router.get("/certificates", internships.listCertificates);
router.post("/interns/:id/certificates", internships.issueCertificate);
router.patch("/certificates/:id/revoke", internships.revokeCertificate);
router.get("/certificates/:id/download", internships.downloadCertificate);
router.post("/attendance", internships.createAttendance);
router.patch("/attendance/:id/verify", internships.verifyAttendance);
router.get("/office-network", internships.getOfficeNetwork);
router.post("/office-network", internships.setOfficeNetwork);
router.delete("/office-network", internships.unsetOfficeNetwork);
router.get("/leaves", internships.listLeaves);
router.patch("/leaves/:id/review", internships.reviewLeave);
router.get("/holidays", internships.listHolidays);
router.post("/holidays", internships.addHoliday);
router.delete("/holidays/:id", internships.deleteHoliday);
router.post("/reports", internships.createReport);
router.patch("/reports/:id/review", internships.reviewReport);
router.post("/tasks", internships.createTask);
router.patch("/tasks/:id", internships.updateTask);

export default router;
