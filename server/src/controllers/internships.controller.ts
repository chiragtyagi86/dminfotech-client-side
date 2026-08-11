import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import * as internships from "../services/internships.service";
import { AuthRequest } from "../middleware/auth";
import { sendCertificatePdf } from "../services/internPdf.service";

export async function getOverview(_req: Request, res: Response): Promise<void> {
  try {
    res.json(await internships.getOverview());
  } catch (err) {
    console.error("[internships/getOverview]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function createIntern(req: Request, res: Response): Promise<void> {
  try {
    const result = await internships.createIntern(req.body);
    res.status(201).json({ ...result, message: "Intern created." });
  } catch (err: any) {
    console.error("[internships/createIntern]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function updateIntern(req: Request, res: Response): Promise<void> {
  try {
    await internships.updateIntern(req.params.id, req.body);
    res.json({ message: "Intern updated." });
  } catch (err: any) {
    console.error("[internships/updateIntern]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function deleteIntern(req: Request, res: Response): Promise<void> {
  try {
    await internships.deleteIntern(req.params.id);
    res.json({ message: "Intern deleted." });
  } catch (err: any) {
    console.error("[internships/deleteIntern]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function downloadInternDocument(req: Request, res: Response): Promise<void> {
  try {
    const documentKey = await internships.getInternPrivateDocument(Number(req.params.id), req.params.type);
    if (!documentKey || !/^[a-f0-9-]+\.pdf$/i.test(documentKey)) {
      res.status(404).json({ message: "Document not found." });
      return;
    }

    const documentPath = path.join(process.cwd(), "private-intern-documents", documentKey);
    if (!fs.existsSync(documentPath)) {
      res.status(404).json({ message: "Document not found." });
      return;
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.sendFile(documentPath);
  } catch (err: any) {
    console.error("[internships/downloadInternDocument]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function createAttendance(req: Request, res: Response): Promise<void> {
  try {
    await internships.createAttendance(req.body);
    res.status(201).json({ message: "Attendance saved." });
  } catch (err: any) {
    console.error("[internships/createAttendance]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function verifyAttendance(req: AuthRequest, res: Response): Promise<void> {
  try {
    await internships.verifyAttendance(req.params.id, req.body.status, req.admin?.email || "admin");
    res.json({ message: "Attendance verification updated." });
  } catch (err: any) {
    console.error("[internships/verifyAttendance]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

function requestIp(req: Request) {
  return internships.internRequestIp(
    req.ip,
    req.headers["x-forwarded-for"]?.toString(),
    req.headers["x-real-ip"]?.toString()
  );
}

export async function getOfficeNetwork(_req: Request, res: Response): Promise<void> {
  try {
    res.json(await internships.getOfficeNetwork());
  } catch (err: any) {
    console.error("[internships/getOfficeNetwork]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function setOfficeNetwork(req: AuthRequest, res: Response): Promise<void> {
  try {
    const ip = requestIp(req);
    await internships.setOfficeNetwork(ip, req.admin?.email || "admin");
    res.json({ message: "Office network updated.", office_ip: ip });
  } catch (err: any) {
    console.error("[internships/setOfficeNetwork]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function unsetOfficeNetwork(_req: Request, res: Response): Promise<void> {
  try {
    await internships.unsetOfficeNetwork();
    res.json({ message: "Office network cleared." });
  } catch (err: any) {
    console.error("[internships/unsetOfficeNetwork]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function listLeaves(_req: Request, res: Response): Promise<void> {
  try {
    res.json(await internships.listLeaves());
  } catch (err: any) {
    console.error("[internships/listLeaves]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function reviewLeave(req: AuthRequest, res: Response): Promise<void> {
  try {
    await internships.reviewLeave(req.params.id, req.body.status, req.admin?.email || "admin");
    res.json({ message: "Leave request updated." });
  } catch (err: any) {
    console.error("[internships/reviewLeave]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function listHolidays(_req: Request, res: Response): Promise<void> {
  try {
    res.json(await internships.listHolidays());
  } catch (err: any) {
    console.error("[internships/listHolidays]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function addHoliday(req: Request, res: Response): Promise<void> {
  try {
    await internships.addHoliday(req.body);
    res.status(201).json({ message: "Holiday saved." });
  } catch (err: any) {
    console.error("[internships/addHoliday]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function deleteHoliday(req: Request, res: Response): Promise<void> {
  try {
    await internships.deleteHoliday(req.params.id);
    res.json({ message: "Holiday deleted." });
  } catch (err: any) {
    console.error("[internships/deleteHoliday]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function createReport(req: Request, res: Response): Promise<void> {
  try {
    await internships.createReport(req.body);
    res.status(201).json({ message: "Report saved." });
  } catch (err: any) {
    console.error("[internships/createReport]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function reviewReport(req: Request, res: Response): Promise<void> {
  try {
    await internships.reviewReport(req.params.id, req.body);
    res.json({ message: "Report reviewed." });
  } catch (err: any) {
    console.error("[internships/reviewReport]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    await internships.createTask(req.body);
    res.status(201).json({ message: "Task created." });
  } catch (err: any) {
    console.error("[internships/createTask]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    await internships.updateTask(req.params.id, req.body);
    res.json({ message: "Task updated." });
  } catch (err: any) {
    console.error("[internships/updateTask]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function getCertificateSettings(_req: Request, res: Response): Promise<void> {
  try { res.json(await internships.getCertificateSettings()); }
  catch (err) { console.error("[internships/getCertificateSettings]", err); res.status(500).json({ message: "Server error." }); }
}

export async function updateCertificateSettings(req: Request, res: Response): Promise<void> {
  try { await internships.updateCertificateSettings(req.body); res.json({ message: "Certificate settings saved." }); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}

export async function listCertificates(_req: Request, res: Response): Promise<void> {
  try { res.json({ certificates: await internships.getAdminCertificates() }); }
  catch (err) { console.error("[internships/listCertificates]", err); res.status(500).json({ message: "Server error." }); }
}

export async function issueCertificate(req: AuthRequest, res: Response): Promise<void> {
  try { res.status(201).json(await internships.issueCertificate(req.params.id, req.admin?.id)); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}

export async function revokeCertificate(req: Request, res: Response): Promise<void> {
  try { await internships.revokeCertificate(req.params.id, req.body.reason); res.json({ message: "Certificate revoked." }); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}

export async function downloadCertificate(req: Request, res: Response): Promise<void> {
  try { sendCertificatePdf(res, await internships.getCertificateForDownload(req.params.id)); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message || "Server error." }); }
}
