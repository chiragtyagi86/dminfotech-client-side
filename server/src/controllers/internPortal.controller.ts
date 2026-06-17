import { Request, Response } from "express";
import { InternAuthRequest } from "../middleware/internAuth";
import * as internships from "../services/internships.service";

const isProd = process.env.NODE_ENV === "production";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const token = await internships.loginIntern(email, password);

    if (!token) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    res.cookie("intern_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("[internPortal/login]", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
}

function requestIp(req: Request) {
  return internships.internRequestIp(
    req.ip,
    req.headers["x-forwarded-for"]?.toString(),
    req.headers["x-real-ip"]?.toString()
  );
}

function userAgent(req: Request) {
  return req.headers["user-agent"]?.toString();
}

export function logout(_req: Request, res: Response): void {
  res.cookie("intern_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
    path: "/",
  });

  res.json({ success: true });
}

export function me(req: InternAuthRequest, res: Response): void {
  res.json({ intern: req.intern ?? null });
}

export async function dashboard(req: InternAuthRequest, res: Response): Promise<void> {
  try {
    res.json(await internships.getInternDashboard(req.intern!.id));
  } catch (err) {
    console.error("[internPortal/dashboard]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function updateProfile(req: InternAuthRequest, res: Response): Promise<void> {
  try {
    await internships.updateInternProfile(req.intern!.id, {
      ...req.body,
      ip: requestIp(req),
      user_agent: userAgent(req),
    });
    res.json({ message: "Profile updated." });
  } catch (err: any) {
    console.error("[internPortal/updateProfile]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function changePassword(req: InternAuthRequest, res: Response): Promise<void> {
  try {
    await internships.changeInternPassword(
      req.intern!.id,
      req.body.currentPassword,
      req.body.newPassword,
      requestIp(req),
      userAgent(req)
    );
    res.json({ message: "Password changed." });
  } catch (err: any) {
    console.error("[internPortal/changePassword]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const result = await internships.createPasswordReset(req.body.email, requestIp(req), userAgent(req));
    res.json({
      message: "If the email exists, a reset link will be sent.",
      resetToken: result.token,
    });
  } catch (err) {
    console.error("[internPortal/forgotPassword]", err);
    res.status(500).json({ message: "Server error." });
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    await internships.resetInternPassword(req.body.token, req.body.newPassword, requestIp(req), userAgent(req));
    res.json({ message: "Password reset successfully." });
  } catch (err: any) {
    console.error("[internPortal/resetPassword]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export function uploadFile(req: Request, res: Response): void {
  if (!req.file) {
    res.status(400).json({ message: "File is required." });
    return;
  }

  res.json({
    url: `/uploads/${req.file.destination.split("/uploads/").pop()}/${req.file.filename}`,
    filename: req.file.originalname,
  });
}

export async function checkIn(req: InternAuthRequest, res: Response): Promise<void> {
  try {
    const ip = requestIp(req);
    await internships.internCheckIn(req.intern!.id, ip);
    res.json({ message: "Checked in successfully." });
  } catch (err: any) {
    console.error("[internPortal/checkIn]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function checkOut(req: InternAuthRequest, res: Response): Promise<void> {
  try {
    const ip = requestIp(req);
    await internships.internCheckOut(req.intern!.id, ip);
    res.json({ message: "Checked out successfully." });
  } catch (err: any) {
    console.error("[internPortal/checkOut]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function submitReport(req: InternAuthRequest, res: Response): Promise<void> {
  try {
    await internships.createInternSelfReport(req.intern!.id, req.body);
    res.status(201).json({ message: "Report submitted." });
  } catch (err: any) {
    console.error("[internPortal/submitReport]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}

export async function updateTask(req: InternAuthRequest, res: Response): Promise<void> {
  try {
    await internships.updateInternSelfTask(req.intern!.id, req.params.id, req.body);
    res.json({ message: "Task updated." });
  } catch (err: any) {
    console.error("[internPortal/updateTask]", err);
    res.status(err.status || 500).json({ message: err.message || "Server error." });
  }
}
