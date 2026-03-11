import { Request, Response, NextFunction } from "express";
import { jwtVerify, JWTPayload } from "jose";

const isProd = process.env.NODE_ENV === "production";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

if (isProd && (!ADMIN_JWT_SECRET || ADMIN_JWT_SECRET.length < 32)) {
  throw new Error(
    "ADMIN_JWT_SECRET must be set and at least 32 characters in production."
  );
}

const JWT_SECRET = new TextEncoder().encode(
  ADMIN_JWT_SECRET || "local-dev-secret-minimum-32-characters"
);

export interface AuthRequest extends Request {
  admin?: {
    id: number;
    email: string;
    role: string;
    name?: string;
  };
}

interface AdminPayload extends JWTPayload {
  id?: number;
  email?: string;
  role?: string;
  name?: string;
}

export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.admin_token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const adminPayload = payload as AdminPayload;

    if (
      typeof adminPayload.id !== "number" ||
      typeof adminPayload.email !== "string" ||
      typeof adminPayload.role !== "string"
    ) {
      res.status(403).json({ message: "Forbidden." });
      return;
    }

    req.admin = {
      id: adminPayload.id,
      email: adminPayload.email,
      role: adminPayload.role,
      name: adminPayload.name,
    };

    next();
  } catch (err) {
    console.error("[auth/requireAdmin]", err);
    res.status(401).json({ message: "Invalid or expired token." });
  }
}