import { Request, Response, NextFunction } from "express";
import { jwtVerify, JWTPayload } from "jose";

const isProd = process.env.NODE_ENV === "production";
const INTERN_JWT_SECRET = process.env.INTERN_JWT_SECRET || process.env.ADMIN_JWT_SECRET;

if (isProd && (!INTERN_JWT_SECRET || INTERN_JWT_SECRET.length < 32)) {
  throw new Error("INTERN_JWT_SECRET must be set and at least 32 characters in production.");
}

const JWT_SECRET = new TextEncoder().encode(
  INTERN_JWT_SECRET || "local-dev-intern-secret-minimum-32-chars"
);

export interface InternAuthRequest extends Request {
  intern?: {
    id: number;
    internId: string;
    email: string;
    name: string;
  };
}

interface InternPayload extends JWTPayload {
  id?: number;
  internId?: string;
  email?: string;
  name?: string;
}

export async function requireIntern(
  req: InternAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.intern_token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const internPayload = payload as InternPayload;

    if (
      typeof internPayload.id !== "number" ||
      typeof internPayload.internId !== "string" ||
      typeof internPayload.email !== "string" ||
      typeof internPayload.name !== "string"
    ) {
      res.status(403).json({ message: "Forbidden." });
      return;
    }

    req.intern = {
      id: internPayload.id,
      internId: internPayload.internId,
      email: internPayload.email,
      name: internPayload.name,
    };

    next();
  } catch (err) {
    console.error("[internAuth/requireIntern]", err);
    res.status(401).json({ message: "Invalid or expired session." });
  }
}

export const internJwtSecret = JWT_SECRET;
