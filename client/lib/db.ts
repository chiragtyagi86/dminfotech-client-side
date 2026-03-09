// lib/db.ts
// ─────────────────────────────────────────────────────────────────────────────
// MySQL connection pool using mysql2/promise.
// Used by all API route handlers.
//
// Required env vars (.env.local):
//   DB_HOST=localhost
//   DB_PORT=3306
//   DB_USER=root
//   DB_PASSWORD=yourpassword
//   DB_NAME=dhanamitra_cms
// ─────────────────────────────────────────────────────────────────────────────

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || "localhost",
  port:               parseInt(process.env.DB_PORT || "3306"),
  user:               process.env.DB_USER     || "root",
  password:           process.env.DB_PASSWORD || "",
  database:           process.env.DB_NAME     || "dhanamitra_cms",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           "+00:00",
});

export default pool;