import { Request, Response } from "express";
import * as internships from "../services/internships.service";

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

export async function createAttendance(req: Request, res: Response): Promise<void> {
  try {
    await internships.createAttendance(req.body);
    res.status(201).json({ message: "Attendance saved." });
  } catch (err: any) {
    console.error("[internships/createAttendance]", err);
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
