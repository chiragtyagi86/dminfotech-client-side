import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { Response } from "express";

function date(value: unknown) {
  return value ? new Date(String(value)).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "-";
}

function line(doc: PDFKit.PDFDocument, label: string, value: unknown) {
  doc.font("Helvetica-Bold").text(`${label}: `, { continued: true });
  doc.font("Helvetica").text(String(value || "-"));
}

export function sendReportPdf(res: Response, report: any) {
  const doc = new PDFDocument({ margin: 54, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="daily-report-${report.report_date}.pdf"`);
  doc.pipe(res);
  doc.fillColor("#25324a").font("Helvetica-Bold").fontSize(22).text("DM Infotech");
  doc.fontSize(16).text("Daily Work Report");
  doc.moveDown();
  line(doc, "Intern", report.full_name);
  line(doc, "Intern ID", report.intern_code);
  line(doc, "Role", report.role);
  line(doc, "Report Date", date(report.report_date));
  line(doc, "Hours Worked", report.hours_worked);
  line(doc, "Review Status", report.mentor_status);
  doc.moveDown();
  [["Tasks Assigned", report.tasks_assigned], ["Tasks Completed", report.tasks_completed], ["Challenges", report.challenges], ["Tomorrow Plan", report.tomorrow_plan], ["Mentor Feedback", report.mentor_feedback]].forEach(([heading, value]) => {
    doc.font("Helvetica-Bold").fontSize(11).text(String(heading));
    doc.font("Helvetica").fontSize(10).fillColor("#333333").text(String(value || "-"));
    doc.moveDown(0.7);
  });
  doc.end();
}

export async function sendCertificatePdf(res: Response, certificate: any) {
  const doc = new PDFDocument({ margin: 54, size: "A4", layout: "landscape" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${certificate.certificate_id}.pdf"`);
  doc.pipe(res);
  doc.rect(22, 22, 798, 550).lineWidth(2).strokeColor("#b28743").stroke();
  doc.fillColor("#25324a").font("Helvetica-Bold").fontSize(28).text("DHANAMITRA INFOTECH LLP", 55, 65, { align: "center" });
  doc.font("Helvetica").fontSize(16).fillColor("#7b5d2e").text("CERTIFICATE OF INTERNSHIP", { align: "center" });
  doc.moveDown(2);
  doc.fillColor("#333333").fontSize(13).text("This is to certify that", { align: "center" });
  doc.moveDown(0.6);
  doc.fillColor("#25324a").font("Helvetica-Bold").fontSize(27).text(certificate.intern_name, { align: "center" });
  doc.moveDown(0.8);
  doc.fillColor("#333333").font("Helvetica").fontSize(13).text(
    `has successfully completed the internship as ${certificate.role || "Intern"} from ${date(certificate.start_date)} to ${date(certificate.end_date)}.`,
    { align: "center", width: 670, indent: 70 }
  );
  doc.fontSize(11).fillColor("#666666").text(`Mentor: ${certificate.mentor_name || "DM Infotech"}`, { align: "center" });
  const verifyUrl = `${process.env.SITE_URL || process.env.CLIENT_URL || "https://dmifotech.com"}/verify-certificate?token=${certificate.verification_token}`;
  const qr = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 130 });
  doc.image(Buffer.from(qr.split(",")[1], "base64"), 67, 420, { width: 88 });
  doc.fontSize(8).fillColor("#666666").text(`Certificate ID: ${certificate.certificate_id}`, 67, 514, { width: 190 });
  if (certificate.signature_image) {
    const filePath = path.join(process.cwd(), certificate.signature_image.replace(/^\/uploads\//, "uploads/"));
    if (fs.existsSync(filePath)) doc.image(filePath, 635, 425, { fit: [120, 55] });
  }
  doc.fillColor("#25324a").font("Helvetica-Bold").fontSize(11).text(certificate.signer_name || "Authorized Signatory", 600, 492, { width: 190, align: "center" });
  doc.font("Helvetica").fontSize(9).text(certificate.signer_designation || "", 600, 508, { width: 190, align: "center" });
  doc.end();
}
