import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import pool from "../config/db"; // adjust path to your mysql pool/connection

const isProd = process.env.NODE_ENV === "production";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

if (isProd && (!ADMIN_JWT_SECRET || ADMIN_JWT_SECRET.length < 32)) {
  throw new Error(
    "ADMIN_JWT_SECRET must be set and at least 32 characters in production."
  );
}

const jwtSecretValue =
  ADMIN_JWT_SECRET || "local-dev-secret-minimum-32-characters";
const JWT_SECRET = new TextEncoder().encode(jwtSecretValue);

export type AdminUserPayload = {
  id: number;
  email: string;
  role: string;
  name?: string;
};

type AdminUserRow = {
  id: number;
  name: string | null;
  email: string;
  password_hash: string;
  role: string;
  status: string;
};

export async function loginAdmin(
  email: string,
  password: string
): Promise<string | null> {
  if (!email || !password) return null;

  const [rows] = await pool.query(
    `
      SELECT id, name, email, password_hash, role, status
      FROM admin_users
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  );

  const admins = rows as AdminUserRow[];

  if (!admins.length) return null;

  const admin = admins[0];

  if (admin.status !== "active") return null;

  const passwordOk = await bcrypt.compare(password, admin.password_hash);
  if (!passwordOk) return null;

  const token = await new SignJWT({
    id: admin.id,
    email: admin.email,
    role: admin.role || "admin",
    name: admin.name || undefined,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
}