import { Request, Response } from "express";
import { loginAdmin } from "../services/auth.service";

const isProd = process.env.NODE_ENV === "production";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const token = await loginAdmin(email, password);

    if (!token) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("[auth/login]", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
}

export function logout(_req: Request, res: Response): void {
  res.cookie("admin_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
    path: "/",
  });

  res.json({ success: true });
}