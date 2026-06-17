import db from "../config/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { internJwtSecret } from "../middleware/internAuth";
import crypto from "crypto";

const INTERN_STATUSES = ["Applied", "Selected", "Active", "On Hold", "Completed", "Terminated"];
const TASK_STATUSES = ["Pending", "In Progress", "Completed", "Overdue"];
const REPORT_STATUSES = ["Pending", "Approved", "Rejected", "Needs Revision"];

type InternPayload = {
  intern_id?: string;
  full_name?: string;
  email?: string;
  mobile?: string;
  college?: string;
  course?: string;
  specialization?: string;
  role?: string;
  mentor_id?: number | string | null;
  batch_id?: number | string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string;
  profile_photo?: string | null;
  resume?: string | null;
  password?: string;
  login_enabled?: boolean | number | string;
};

function clean(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  return str || null;
}

function cleanNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function assertStatus(value: string | undefined, allowed: string[], fallback: string) {
  const status = value || fallback;
  if (!allowed.includes(status)) {
    throw Object.assign(new Error(`Invalid status. Allowed: ${allowed.join(", ")}.`), { status: 400 });
  }
  return status;
}

function toDateKey(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

export async function ensureInternshipSchema(): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS internship_mentors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      email VARCHAR(180) NULL,
      department VARCHAR(120) NULL,
      designation VARCHAR(140) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS internship_batches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      batch_name VARCHAR(160) NOT NULL,
      start_date DATE NULL,
      end_date DATE NULL,
      mode ENUM('Remote','Onsite','Hybrid') DEFAULT 'Hybrid',
      status ENUM('Upcoming','Active','Completed','Paused') DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS internship_projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      client VARCHAR(160) NULL,
      technology VARCHAR(180) NULL,
      mentor_id INT NULL,
      status ENUM('Planned','Active','Completed','Paused') DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS interns (
      id INT AUTO_INCREMENT PRIMARY KEY,
      intern_id VARCHAR(80) NOT NULL UNIQUE,
      full_name VARCHAR(180) NOT NULL,
      email VARCHAR(180) NOT NULL,
      mobile VARCHAR(40) NULL,
      college VARCHAR(180) NULL,
      course VARCHAR(120) NULL,
      specialization VARCHAR(160) NULL,
      role VARCHAR(140) NULL,
      mentor_id INT NULL,
      batch_id INT NULL,
      start_date DATE NULL,
      end_date DATE NULL,
      status ENUM('Applied','Selected','Active','On Hold','Completed','Terminated') DEFAULT 'Applied',
      profile_photo VARCHAR(255) NULL,
      resume VARCHAR(255) NULL,
      password_hash VARCHAR(255) NULL,
      login_enabled TINYINT(1) DEFAULT 1,
      must_change_password TINYINT(1) DEFAULT 0,
      last_login_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_interns_status (status),
      INDEX idx_interns_college (college),
      INDEX idx_interns_role (role),
      INDEX idx_interns_batch (batch_id)
    )
  `);

  await addColumnIfMissing("interns", "password_hash", "VARCHAR(255) NULL");
  await addColumnIfMissing("interns", "login_enabled", "TINYINT(1) DEFAULT 1");
  await addColumnIfMissing("interns", "must_change_password", "TINYINT(1) DEFAULT 0");
  await addColumnIfMissing("interns", "last_login_at", "DATETIME NULL");

  await db.query(`
    CREATE TABLE IF NOT EXISTS intern_password_resets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      intern_id INT NOT NULL,
      token_hash VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_intern_reset_token (token_hash),
      INDEX idx_intern_reset_intern (intern_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS intern_audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      intern_id INT NULL,
      action VARCHAR(80) NOT NULL,
      ip_address VARCHAR(80) NULL,
      user_agent VARCHAR(255) NULL,
      metadata JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_intern_audit_intern (intern_id),
      INDEX idx_intern_audit_action (action)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS intern_assignments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      intern_id INT NOT NULL,
      project_id INT NULL,
      assigned_date DATE NULL,
      deadline DATE NULL,
      status ENUM('Pending','In Progress','Completed','Overdue') DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_assignments_intern (intern_id),
      INDEX idx_assignments_project (project_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS intern_attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      intern_id INT NOT NULL,
      attendance_date DATE NOT NULL,
      check_in TIME NULL,
      check_out TIME NULL,
      work_mode ENUM('Office','Remote','Hybrid') DEFAULT 'Office',
      remarks TEXT NULL,
      status ENUM('Present','Absent','Late','Half Day') DEFAULT 'Present',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_intern_attendance (intern_id, attendance_date),
      INDEX idx_attendance_date (attendance_date)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS intern_work_reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      intern_id INT NOT NULL,
      report_date DATE NOT NULL,
      tasks_assigned TEXT NULL,
      tasks_completed TEXT NULL,
      hours_worked DECIMAL(5,2) DEFAULT 0,
      challenges TEXT NULL,
      tomorrow_plan TEXT NULL,
      attachment VARCHAR(255) NULL,
      mentor_status ENUM('Pending','Approved','Rejected','Needs Revision') DEFAULT 'Pending',
      mentor_feedback TEXT NULL,
      reviewed_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_intern_report (intern_id, report_date),
      INDEX idx_reports_status (mentor_status)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS intern_tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      description TEXT NULL,
      priority ENUM('Low','Medium','High','Urgent') DEFAULT 'Medium',
      deadline DATE NULL,
      assigned_to INT NULL,
      mentor_id INT NULL,
      progress TINYINT UNSIGNED DEFAULT 0,
      status ENUM('Pending','In Progress','Completed','Overdue') DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_tasks_assigned_to (assigned_to),
      INDEX idx_tasks_status (status)
    )
  `);
}

async function addColumnIfMissing(table: string, column: string, definition: string) {
  const [rows] = await db.query<any[]>(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
     LIMIT 1`,
    [table, column]
  );

  if (!rows.length) {
    await db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

export async function getOverview() {
  await ensureInternshipSchema();

  const [interns] = await db.query<any[]>(`
    SELECT i.id, i.intern_id, i.full_name, i.email, i.mobile, i.college, i.course,
           i.specialization, i.role, i.mentor_id, i.batch_id, i.start_date, i.end_date,
           i.status, i.profile_photo, i.resume, i.login_enabled, i.must_change_password,
           i.last_login_at, i.created_at, i.updated_at, m.name AS mentor_name, b.batch_name
    FROM interns i
    LEFT JOIN internship_mentors m ON m.id = i.mentor_id
    LEFT JOIN internship_batches b ON b.id = i.batch_id
    ORDER BY i.created_at DESC
  `);

  const [mentors] = await db.query<any[]>("SELECT * FROM internship_mentors ORDER BY name ASC");
  const [batches] = await db.query<any[]>("SELECT * FROM internship_batches ORDER BY start_date DESC, id DESC");
  const [projects] = await db.query<any[]>("SELECT * FROM internship_projects ORDER BY created_at DESC");

  const [attendance] = await db.query<any[]>(`
    SELECT a.*, i.full_name, i.intern_id AS intern_code
    FROM intern_attendance a
    JOIN interns i ON i.id = a.intern_id
    ORDER BY a.attendance_date DESC, a.created_at DESC
    LIMIT 80
  `);

  const [reports] = await db.query<any[]>(`
    SELECT r.*, i.full_name, i.intern_id AS intern_code, m.name AS mentor_name
    FROM intern_work_reports r
    JOIN interns i ON i.id = r.intern_id
    LEFT JOIN internship_mentors m ON m.id = i.mentor_id
    ORDER BY r.report_date DESC, r.created_at DESC
    LIMIT 80
  `);

  const [tasks] = await db.query<any[]>(`
    SELECT t.*, i.full_name AS assigned_name, m.name AS mentor_name
    FROM intern_tasks t
    LEFT JOIN interns i ON i.id = t.assigned_to
    LEFT JOIN internship_mentors m ON m.id = t.mentor_id
    ORDER BY t.created_at DESC
    LIMIT 100
  `);

  const today = new Date().toISOString().slice(0, 10);
  const presentToday = attendance.filter((item) => toDateKey(item.attendance_date) === today && item.status !== "Absent").length;
  const activeInterns = interns.filter((item) => item.status === "Active").length;
  const completedInternships = interns.filter((item) => item.status === "Completed").length;
  const pendingReports = reports.filter((item) => item.mentor_status === "Pending").length;
  const completedTasks = tasks.filter((item) => item.status === "Completed").length;

  return {
    stats: {
      totalInterns: interns.length,
      activeInterns,
      completedInternships,
      presentToday,
      absentToday: Math.max(activeInterns - presentToday, 0),
      pendingReports,
      taskCompletion: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
    },
    interns,
    mentors,
    batches,
    projects,
    attendance,
    reports,
    tasks,
  };
}

export async function createIntern(body: InternPayload) {
  await ensureInternshipSchema();
  if (!body.full_name?.trim()) throw Object.assign(new Error("Full name is required."), { status: 400 });
  if (!body.email?.trim()) throw Object.assign(new Error("Email is required."), { status: 400 });

  const internId = body.intern_id?.trim() || `DMI-${Date.now().toString().slice(-7)}`;
  const status = assertStatus(body.status, INTERN_STATUSES, "Applied");
  const passwordHash = body.password?.trim()
    ? await bcrypt.hash(body.password.trim(), 10)
    : null;

  const [result] = await db.query<any>(
    `INSERT INTO interns
     (intern_id, full_name, email, mobile, college, course, specialization, role, mentor_id, batch_id, start_date, end_date, status, profile_photo, resume, password_hash, login_enabled, must_change_password)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      internId,
      body.full_name.trim(),
      body.email.trim().toLowerCase(),
      clean(body.mobile),
      clean(body.college),
      clean(body.course),
      clean(body.specialization),
      clean(body.role),
      cleanNumber(body.mentor_id),
      cleanNumber(body.batch_id),
      clean(body.start_date),
      clean(body.end_date),
      status,
      clean(body.profile_photo),
      clean(body.resume),
      passwordHash,
      body.login_enabled === false || body.login_enabled === "0" ? 0 : 1,
      passwordHash ? 1 : 0,
    ]
  );

  return { id: result.insertId };
}

export async function updateIntern(id: string, body: InternPayload) {
  await ensureInternshipSchema();
  if (!body.full_name?.trim()) throw Object.assign(new Error("Full name is required."), { status: 400 });
  if (!body.email?.trim()) throw Object.assign(new Error("Email is required."), { status: 400 });
  const status = assertStatus(body.status, INTERN_STATUSES, "Applied");
  const passwordHash = body.password?.trim()
    ? await bcrypt.hash(body.password.trim(), 10)
    : null;

  const passwordSql = passwordHash ? ", password_hash=?, must_change_password=1" : "";
  const values: any[] = [
    body.intern_id?.trim(),
    body.full_name.trim(),
    body.email.trim().toLowerCase(),
    clean(body.mobile),
    clean(body.college),
    clean(body.course),
    clean(body.specialization),
    clean(body.role),
    cleanNumber(body.mentor_id),
    cleanNumber(body.batch_id),
    clean(body.start_date),
    clean(body.end_date),
    status,
    clean(body.profile_photo),
    clean(body.resume),
    body.login_enabled === false || body.login_enabled === "0" ? 0 : 1,
  ];

  if (passwordHash) values.push(passwordHash);
  values.push(id);

  await db.query(
    `UPDATE interns SET intern_id=?, full_name=?, email=?, mobile=?, college=?, course=?,
     specialization=?, role=?, mentor_id=?, batch_id=?, start_date=?, end_date=?, status=?,
     profile_photo=?, resume=?, login_enabled=?${passwordSql}, updated_at=NOW()
     WHERE id=?`,
    values
  );
}

export async function deleteIntern(id: string) {
  await ensureInternshipSchema();
  await db.query("DELETE FROM intern_tasks WHERE assigned_to = ?", [id]);
  await db.query("DELETE FROM intern_work_reports WHERE intern_id = ?", [id]);
  await db.query("DELETE FROM intern_attendance WHERE intern_id = ?", [id]);
  await db.query("DELETE FROM intern_assignments WHERE intern_id = ?", [id]);
  await db.query("DELETE FROM interns WHERE id = ?", [id]);
}

export async function createAttendance(body: any) {
  await ensureInternshipSchema();
  if (!body.intern_id) throw Object.assign(new Error("Intern is required."), { status: 400 });
  if (!body.attendance_date) throw Object.assign(new Error("Date is required."), { status: 400 });

  await db.query(
    `INSERT INTO intern_attendance (intern_id, attendance_date, check_in, check_out, work_mode, remarks, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE check_in=VALUES(check_in), check_out=VALUES(check_out),
       work_mode=VALUES(work_mode), remarks=VALUES(remarks), status=VALUES(status), updated_at=NOW()`,
    [
      body.intern_id,
      body.attendance_date,
      clean(body.check_in),
      clean(body.check_out),
      body.work_mode || "Office",
      clean(body.remarks),
      body.status || "Present",
    ]
  );
}

export async function createReport(body: any) {
  await ensureInternshipSchema();
  if (!body.intern_id) throw Object.assign(new Error("Intern is required."), { status: 400 });
  if (!body.report_date) throw Object.assign(new Error("Date is required."), { status: 400 });

  await db.query(
    `INSERT INTO intern_work_reports
     (intern_id, report_date, tasks_assigned, tasks_completed, hours_worked, challenges, tomorrow_plan, attachment, mentor_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
     ON DUPLICATE KEY UPDATE tasks_assigned=VALUES(tasks_assigned), tasks_completed=VALUES(tasks_completed),
       hours_worked=VALUES(hours_worked), challenges=VALUES(challenges), tomorrow_plan=VALUES(tomorrow_plan),
       attachment=VALUES(attachment), mentor_status='Pending', updated_at=NOW()`,
    [
      body.intern_id,
      body.report_date,
      clean(body.tasks_assigned),
      clean(body.tasks_completed),
      Number(body.hours_worked || 0),
      clean(body.challenges),
      clean(body.tomorrow_plan),
      clean(body.attachment),
    ]
  );
}

export async function reviewReport(id: string, body: any) {
  await ensureInternshipSchema();
  const mentorStatus = assertStatus(body.mentor_status, REPORT_STATUSES, "Pending");
  await db.query(
    "UPDATE intern_work_reports SET mentor_status=?, mentor_feedback=?, reviewed_at=NOW(), updated_at=NOW() WHERE id=?",
    [mentorStatus, clean(body.mentor_feedback), id]
  );
}

export async function createTask(body: any) {
  await ensureInternshipSchema();
  if (!body.title?.trim()) throw Object.assign(new Error("Task title is required."), { status: 400 });
  const status = assertStatus(body.status, TASK_STATUSES, "Pending");
  const progress = Math.max(0, Math.min(100, Number(body.progress || 0)));

  await db.query(
    `INSERT INTO intern_tasks (title, description, priority, deadline, assigned_to, mentor_id, progress, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      body.title.trim(),
      clean(body.description),
      body.priority || "Medium",
      clean(body.deadline),
      cleanNumber(body.assigned_to),
      cleanNumber(body.mentor_id),
      progress,
      status,
    ]
  );
}

export async function updateTask(id: string, body: any) {
  await ensureInternshipSchema();
  const status = assertStatus(body.status, TASK_STATUSES, "Pending");
  const progress = Math.max(0, Math.min(100, Number(body.progress || 0)));

  await db.query(
    "UPDATE intern_tasks SET progress=?, status=?, updated_at=NOW() WHERE id=?",
    [progress, status, id]
  );
}

async function logInternAudit(internId: number | null, action: string, ip?: string, userAgent?: string, metadata?: Record<string, unknown>) {
  await db.query(
    `INSERT INTO intern_audit_logs (intern_id, action, ip_address, user_agent, metadata)
     VALUES (?, ?, ?, ?, ?)`,
    [
      internId,
      action,
      clean(ip),
      clean(userAgent)?.slice(0, 255) || null,
      metadata ? JSON.stringify(metadata) : null,
    ]
  );
}

async function assertPasswordReady(internId: number) {
  const [rows] = await db.query<any[]>(
    "SELECT must_change_password FROM interns WHERE id=? LIMIT 1",
    [internId]
  );

  if (rows[0]?.must_change_password) {
    throw Object.assign(new Error("Please change your temporary password first."), { status: 403 });
  }
}

export async function loginIntern(email: string, password: string): Promise<string | null> {
  await ensureInternshipSchema();
  if (!email || !password) return null;

  const [rows] = await db.query<any[]>(
    `SELECT id, intern_id, full_name, email, password_hash, status, login_enabled, must_change_password
     FROM interns
     WHERE email = ?
     LIMIT 1`,
    [email.trim().toLowerCase()]
  );

  if (!rows.length) return null;
  const intern = rows[0];
  if (!intern.login_enabled || !intern.password_hash) return null;
  if (intern.status === "Terminated") return null;

  const passwordOk = await bcrypt.compare(password, intern.password_hash);
  if (!passwordOk) return null;

  await db.query("UPDATE interns SET last_login_at=NOW() WHERE id=?", [intern.id]);
  await logInternAudit(intern.id, "login");

  return new SignJWT({
    id: intern.id,
    internId: intern.intern_id,
    email: intern.email,
    name: intern.full_name,
    mustChangePassword: Boolean(intern.must_change_password),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(internJwtSecret);
}

export async function getInternDashboard(internId: number) {
  await ensureInternshipSchema();

  const [profileRows] = await db.query<any[]>(
    `SELECT i.id, i.intern_id, i.full_name, i.email, i.mobile, i.college, i.course,
            i.specialization, i.role, i.start_date, i.end_date, i.status, i.profile_photo,
            i.resume, i.must_change_password, m.name AS mentor_name, b.batch_name
     FROM interns i
     LEFT JOIN internship_mentors m ON m.id = i.mentor_id
     LEFT JOIN internship_batches b ON b.id = i.batch_id
     WHERE i.id = ?
     LIMIT 1`,
    [internId]
  );

  const [attendanceRows] = await db.query<any[]>(
    `SELECT * FROM intern_attendance
     WHERE intern_id = ?
     ORDER BY attendance_date DESC
     LIMIT 40`,
    [internId]
  );

  const [todayRows] = await db.query<any[]>(
    `SELECT * FROM intern_attendance
     WHERE intern_id = ? AND attendance_date = CURRENT_DATE()
     LIMIT 1`,
    [internId]
  );

  const [reports] = await db.query<any[]>(
    `SELECT * FROM intern_work_reports
     WHERE intern_id = ?
     ORDER BY report_date DESC
     LIMIT 40`,
    [internId]
  );

  const [tasks] = await db.query<any[]>(
    `SELECT * FROM intern_tasks
     WHERE assigned_to = ?
     ORDER BY deadline IS NULL, deadline ASC, created_at DESC`,
    [internId]
  );

  return {
    profile: profileRows[0] || null,
    todayAttendance: todayRows[0] || null,
    attendance: attendanceRows,
    reports,
    tasks,
  };
}

export async function updateInternProfile(internId: number, body: any) {
  await ensureInternshipSchema();
  await db.query(
    `UPDATE interns SET mobile=?, college=?, course=?, specialization=?, profile_photo=?, resume=?, updated_at=NOW()
     WHERE id=?`,
    [
      clean(body.mobile),
      clean(body.college),
      clean(body.course),
      clean(body.specialization),
      clean(body.profile_photo),
      clean(body.resume),
      internId,
    ]
  );
  await logInternAudit(internId, "profile_update", body.ip, body.user_agent);
}

export async function changeInternPassword(internId: number, currentPassword: string, newPassword: string, ip?: string, userAgent?: string) {
  await ensureInternshipSchema();
  if (!newPassword || newPassword.length < 8) {
    throw Object.assign(new Error("New password must be at least 8 characters."), { status: 400 });
  }

  const [rows] = await db.query<any[]>(
    "SELECT password_hash FROM interns WHERE id=? LIMIT 1",
    [internId]
  );
  if (!rows.length || !rows[0].password_hash) {
    throw Object.assign(new Error("Password is not configured."), { status: 400 });
  }

  const passwordOk = await bcrypt.compare(currentPassword || "", rows[0].password_hash);
  if (!passwordOk) {
    throw Object.assign(new Error("Current password is incorrect."), { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.query(
    "UPDATE interns SET password_hash=?, must_change_password=0, updated_at=NOW() WHERE id=?",
    [passwordHash, internId]
  );
  await logInternAudit(internId, "password_change", ip, userAgent);
}

export async function createPasswordReset(email: string, ip?: string, userAgent?: string) {
  await ensureInternshipSchema();
  const [rows] = await db.query<any[]>(
    "SELECT id FROM interns WHERE email=? AND login_enabled=1 LIMIT 1",
    [email?.trim().toLowerCase()]
  );

  if (!rows.length) return { token: null };

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await db.query(
    `INSERT INTO intern_password_resets (intern_id, token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))`,
    [rows[0].id, tokenHash]
  );
  await logInternAudit(rows[0].id, "password_reset_requested", ip, userAgent);

  return {
    token: process.env.NODE_ENV === "production" ? null : token,
  };
}

export async function resetInternPassword(token: string, newPassword: string, ip?: string, userAgent?: string) {
  await ensureInternshipSchema();
  if (!newPassword || newPassword.length < 8) {
    throw Object.assign(new Error("New password must be at least 8 characters."), { status: 400 });
  }

  const tokenHash = crypto.createHash("sha256").update(token || "").digest("hex");
  const [rows] = await db.query<any[]>(
    `SELECT id, intern_id
     FROM intern_password_resets
     WHERE token_hash=? AND used_at IS NULL AND expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  );

  if (!rows.length) {
    throw Object.assign(new Error("Invalid or expired reset token."), { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.query("UPDATE interns SET password_hash=?, must_change_password=0, updated_at=NOW() WHERE id=?", [
    passwordHash,
    rows[0].intern_id,
  ]);
  await db.query("UPDATE intern_password_resets SET used_at=NOW() WHERE id=?", [rows[0].id]);
  await logInternAudit(rows[0].intern_id, "password_reset_completed", ip, userAgent);
}

function getRequesterIp(reqIp: string | undefined, forwarded: string | undefined, realIp: string | undefined) {
  return forwarded?.split(",")[0]?.trim() || realIp || reqIp || "";
}

export function assertAttendanceIpAllowed(ip: string) {
  const allowed = (process.env.INTERNSHIP_ATTENDANCE_IPS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (allowed.length && !allowed.includes(ip)) {
    throw Object.assign(new Error("Attendance is allowed only from approved office networks."), { status: 403 });
  }
}

export async function internCheckIn(internId: number, ip: string) {
  await ensureInternshipSchema();
  assertAttendanceIpAllowed(ip);
  await assertPasswordReady(internId);

  const [existing] = await db.query<any[]>(
    "SELECT id, check_in FROM intern_attendance WHERE intern_id=? AND attendance_date=CURRENT_DATE() LIMIT 1",
    [internId]
  );

  if (existing.length && existing[0].check_in) {
    throw Object.assign(new Error("You are already checked in for today."), { status: 409 });
  }

  const lateAfter = process.env.INTERNSHIP_LATE_AFTER || "10:15:00";
  await db.query(
    `INSERT INTO intern_attendance (intern_id, attendance_date, check_in, work_mode, status, remarks)
     VALUES (?, CURRENT_DATE(), CURRENT_TIME(), 'Office', IF(CURRENT_TIME() > ?, 'Late', 'Present'), ?)
     ON DUPLICATE KEY UPDATE
       check_in = COALESCE(check_in, CURRENT_TIME()),
       status = IF(status = 'Absent', IF(CURRENT_TIME() > ?, 'Late', 'Present'), status),
       updated_at = NOW()`,
    [internId, lateAfter, ip ? `Check-in IP: ${ip}` : null, lateAfter]
  );
  await logInternAudit(internId, "check_in", ip);
}

export async function internCheckOut(internId: number, ip: string) {
  await ensureInternshipSchema();
  assertAttendanceIpAllowed(ip);
  await assertPasswordReady(internId);

  const [rows] = await db.query<any[]>(
    "SELECT id, check_in, check_out FROM intern_attendance WHERE intern_id=? AND attendance_date=CURRENT_DATE() LIMIT 1",
    [internId]
  );

  if (!rows.length || !rows[0].check_in) {
    throw Object.assign(new Error("Please check in before checking out."), { status: 400 });
  }
  if (rows[0].check_out) {
    throw Object.assign(new Error("You are already checked out for today."), { status: 409 });
  }

  await db.query(
    `UPDATE intern_attendance
     SET check_out=CURRENT_TIME(), updated_at=NOW()
     WHERE intern_id=? AND attendance_date=CURRENT_DATE()`,
    [internId]
  );
  await logInternAudit(internId, "check_out", ip);
}

export async function createInternSelfReport(internId: number, body: any) {
  await ensureInternshipSchema();
  await assertPasswordReady(internId);

  await db.query(
    `INSERT INTO intern_work_reports
     (intern_id, report_date, tasks_assigned, tasks_completed, hours_worked, challenges, tomorrow_plan, attachment, mentor_status)
     VALUES (?, CURRENT_DATE(), ?, ?, ?, ?, ?, ?, 'Pending')
     ON DUPLICATE KEY UPDATE tasks_assigned=VALUES(tasks_assigned), tasks_completed=VALUES(tasks_completed),
       hours_worked=VALUES(hours_worked), challenges=VALUES(challenges), tomorrow_plan=VALUES(tomorrow_plan),
       attachment=VALUES(attachment), mentor_status='Pending', updated_at=NOW()`,
    [
      internId,
      clean(body.tasks_assigned),
      clean(body.tasks_completed),
      Number(body.hours_worked || 0),
      clean(body.challenges),
      clean(body.tomorrow_plan),
      clean(body.attachment),
    ]
  );
  await logInternAudit(internId, "daily_report_submit");
}

export async function updateInternSelfTask(internId: number, taskId: string, body: any) {
  await ensureInternshipSchema();
  await assertPasswordReady(internId);
  const progress = Math.max(0, Math.min(100, Number(body.progress || 0)));
  const status = progress === 100 ? "Completed" : progress > 0 ? "In Progress" : "Pending";

  await db.query(
    "UPDATE intern_tasks SET progress=?, status=?, updated_at=NOW() WHERE id=? AND assigned_to=?",
    [progress, status, taskId, internId]
  );
  await logInternAudit(internId, "task_progress_update", undefined, undefined, { taskId, progress, status });
}

export const internRequestIp = getRequesterIp;
