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
  aadhaar_card_document?: string | null;
  cancelled_cheque_document?: string | null;
  tenth_school?: string | null;
  tenth_board?: string | null;
  tenth_passing_year?: number | string | null;
  tenth_percentage?: number | string | null;
  twelfth_school?: string | null;
  twelfth_board?: string | null;
  twelfth_passing_year?: number | string | null;
  twelfth_percentage?: number | string | null;
  college_university?: string | null;
  college_start_year?: number | string | null;
  college_passing_year?: number | string | null;
  college_percentage?: number | string | null;
  bank_account_holder_name?: string | null;
  bank_account_number?: string | null;
  bank_name?: string | null;
  bank_ifsc_code?: string | null;
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

function cleanPercentage(value: unknown, label: string): number | null {
  if (value === undefined || value === null || value === "") return null;
  const percentage = Number(value);
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    throw Object.assign(new Error(`${label} must be between 0 and 100.`), { status: 400 });
  }
  return percentage;
}

function cleanYear(value: unknown, label: string): number | null {
  if (value === undefined || value === null || value === "") return null;
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1950 || year > 2100) {
    throw Object.assign(new Error(`${label} must be a valid year.`), { status: 400 });
  }
  return year;
}

function normalizeBankAccountNumber(value: unknown): string | null {
  const number = clean(value)?.replace(/[\s-]/g, "") || null;
  if (number && !/^\d{9,18}$/.test(number)) {
    throw Object.assign(new Error("Bank account number must contain 9 to 18 digits."), { status: 400 });
  }
  return number;
}

function normalizeIfsc(value: unknown): string | null {
  const ifsc = clean(value)?.toUpperCase() || null;
  if (ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
    throw Object.assign(new Error("Enter a valid 11-character IFSC code."), { status: 400 });
  }
  return ifsc;
}

function getSensitiveDataKey(): Buffer {
  const source = process.env.INTERN_SENSITIVE_DATA_KEY || process.env.ADMIN_JWT_SECRET || "local-dev-intern-sensitive-data-key";
  return crypto.createHash("sha256").update(source).digest();
}

function encryptSensitiveValue(value: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getSensitiveDataKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("base64")}.${cipher.getAuthTag().toString("base64")}.${encrypted.toString("base64")}`;
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

const REQUIRED_PROFILE_FIELDS = [
  "mobile", "college", "course", "specialization", "resume",
  "aadhaar_card_document", "cancelled_cheque_document",
  "tenth_school", "tenth_board", "tenth_passing_year", "tenth_percentage",
  "twelfth_school", "twelfth_board", "twelfth_passing_year", "twelfth_percentage",
  "college_university", "college_start_year", "college_passing_year", "college_percentage",
  "bank_account_holder_name", "bank_account_number_encrypted", "bank_name", "bank_ifsc_code",
] as const;

function getProfileCompletion(profile: Record<string, any> | undefined) {
  const missing = REQUIRED_PROFILE_FIELDS.filter((field) => {
    const value = profile?.[field];
    return value === null || value === undefined || value === "";
  });
  return { complete: missing.length === 0, missing };
}

async function assertProfileComplete(internId: number) {
  const [rows] = await db.query<any[]>(
    `SELECT mobile, college, course, specialization, resume, aadhaar_card_document, cancelled_cheque_document,
            tenth_school, tenth_board, tenth_passing_year, tenth_percentage, twelfth_school, twelfth_board,
            twelfth_passing_year, twelfth_percentage, college_university, college_start_year,
            college_passing_year, college_percentage, bank_account_holder_name,
            bank_account_number_encrypted, bank_name, bank_ifsc_code
     FROM interns WHERE id=? LIMIT 1`,
    [internId]
  );
  const completion = getProfileCompletion(rows[0]);
  if (!completion.complete) {
    throw Object.assign(new Error("Complete your onboarding profile before using internship features."), {
      status: 403,
      missing: completion.missing,
    });
  }
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
      aadhaar_card_document VARCHAR(255) NULL,
      cancelled_cheque_document VARCHAR(255) NULL,
      tenth_school VARCHAR(180) NULL,
      tenth_board VARCHAR(140) NULL,
      tenth_passing_year SMALLINT NULL,
      tenth_percentage DECIMAL(5,2) NULL,
      twelfth_school VARCHAR(180) NULL,
      twelfth_board VARCHAR(140) NULL,
      twelfth_passing_year SMALLINT NULL,
      twelfth_percentage DECIMAL(5,2) NULL,
      college_university VARCHAR(180) NULL,
      college_start_year SMALLINT NULL,
      college_passing_year SMALLINT NULL,
      college_percentage DECIMAL(5,2) NULL,
      bank_account_holder_name VARCHAR(180) NULL,
      bank_account_number_encrypted TEXT NULL,
      bank_account_last4 CHAR(4) NULL,
      bank_name VARCHAR(180) NULL,
      bank_ifsc_code VARCHAR(11) NULL,
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
  await addColumnIfMissing("interns", "aadhaar_card_document", "VARCHAR(255) NULL");
  await addColumnIfMissing("interns", "cancelled_cheque_document", "VARCHAR(255) NULL");
  await addColumnIfMissing("interns", "tenth_school", "VARCHAR(180) NULL");
  await addColumnIfMissing("interns", "tenth_board", "VARCHAR(140) NULL");
  await addColumnIfMissing("interns", "tenth_passing_year", "SMALLINT NULL");
  await addColumnIfMissing("interns", "tenth_percentage", "DECIMAL(5,2) NULL");
  await addColumnIfMissing("interns", "twelfth_school", "VARCHAR(180) NULL");
  await addColumnIfMissing("interns", "twelfth_board", "VARCHAR(140) NULL");
  await addColumnIfMissing("interns", "twelfth_passing_year", "SMALLINT NULL");
  await addColumnIfMissing("interns", "twelfth_percentage", "DECIMAL(5,2) NULL");
  await addColumnIfMissing("interns", "college_university", "VARCHAR(180) NULL");
  await addColumnIfMissing("interns", "college_start_year", "SMALLINT NULL");
  await addColumnIfMissing("interns", "college_passing_year", "SMALLINT NULL");
  await addColumnIfMissing("interns", "college_percentage", "DECIMAL(5,2) NULL");
  await addColumnIfMissing("interns", "bank_account_holder_name", "VARCHAR(180) NULL");
  await addColumnIfMissing("interns", "bank_account_number_encrypted", "TEXT NULL");
  await addColumnIfMissing("interns", "bank_account_last4", "CHAR(4) NULL");
  await addColumnIfMissing("interns", "bank_name", "VARCHAR(180) NULL");
  await addColumnIfMissing("interns", "bank_ifsc_code", "VARCHAR(11) NULL");

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
      late_reason TEXT NULL,
      verification_status ENUM('Approved','Pending','Rejected') DEFAULT 'Approved',
      verified_by VARCHAR(180) NULL,
      verified_at DATETIME NULL,
      status ENUM('Present','Absent','Late','Half Day') DEFAULT 'Present',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_intern_attendance (intern_id, attendance_date),
      INDEX idx_attendance_date (attendance_date)
    )
  `);

  await addColumnIfMissing("intern_attendance", "late_reason", "TEXT NULL");
  await addColumnIfMissing("intern_attendance", "verification_status", "ENUM('Approved','Pending','Rejected') DEFAULT 'Approved'");
  await addColumnIfMissing("intern_attendance", "verified_by", "VARCHAR(180) NULL");
  await addColumnIfMissing("intern_attendance", "verified_at", "DATETIME NULL");

  await db.query(`
    CREATE TABLE IF NOT EXISTS intern_leaves (
      id INT AUTO_INCREMENT PRIMARY KEY,
      intern_id INT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      reason TEXT NULL,
      status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
      reviewed_by VARCHAR(180) NULL,
      reviewed_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_leaves_intern (intern_id),
      INDEX idx_leaves_dates (start_date, end_date)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS internship_holidays (
      id INT AUTO_INCREMENT PRIMARY KEY,
      holiday_date DATE NOT NULL UNIQUE,
      name VARCHAR(180) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS internship_attendance_settings (
      id TINYINT PRIMARY KEY,
      office_ip VARCHAR(64) NULL,
      set_by VARCHAR(180) NULL,
      set_at DATETIME NULL
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

  await db.query(`
    CREATE TABLE IF NOT EXISTS intern_certificate_settings (
      id TINYINT PRIMARY KEY,
      signature_image VARCHAR(255) NULL,
      signer_name VARCHAR(160) NULL,
      signer_designation VARCHAR(160) NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS intern_certificates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      intern_id INT NOT NULL,
      certificate_id VARCHAR(80) NOT NULL UNIQUE,
      verification_token VARCHAR(100) NOT NULL UNIQUE,
      status ENUM('Issued','Revoked') DEFAULT 'Issued',
      issued_at DATETIME NOT NULL,
      revoked_at DATETIME NULL,
      revoked_reason VARCHAR(255) NULL,
      intern_name VARCHAR(180) NOT NULL,
      role VARCHAR(140) NULL,
      start_date DATE NULL,
      end_date DATE NULL,
      mentor_name VARCHAR(160) NULL,
      signature_image VARCHAR(255) NULL,
      signer_name VARCHAR(160) NULL,
      signer_designation VARCHAR(160) NULL,
      issued_by_admin_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_certificates_intern (intern_id),
      INDEX idx_certificates_status (status)
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
           i.status, i.profile_photo, i.resume, i.aadhaar_card_document, i.cancelled_cheque_document,
           i.tenth_school, i.tenth_board, i.tenth_passing_year, i.tenth_percentage,
           i.twelfth_school, i.twelfth_board, i.twelfth_passing_year, i.twelfth_percentage,
           i.college_university, i.college_start_year, i.college_passing_year, i.college_percentage,
           i.bank_account_holder_name, i.bank_name, i.bank_ifsc_code, i.bank_account_last4,
           i.login_enabled, i.must_change_password,
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
            i.resume, i.aadhaar_card_document, i.cancelled_cheque_document,
            i.tenth_school, i.tenth_board, i.tenth_passing_year, i.tenth_percentage,
            i.twelfth_school, i.twelfth_board, i.twelfth_passing_year, i.twelfth_percentage,
            i.college_university, i.college_start_year, i.college_passing_year, i.college_percentage,
            i.bank_account_holder_name, CASE WHEN i.bank_account_number_encrypted IS NULL THEN NULL ELSE 'present' END AS bank_account_number_encrypted,
            i.bank_account_last4, i.bank_name, i.bank_ifsc_code,
            i.must_change_password, m.name AS mentor_name, b.batch_name
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
     LIMIT 5`,
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
     LIMIT 5`,
    [internId]
  );

  const [tasks] = await db.query<any[]>(
    `SELECT * FROM intern_tasks
     WHERE assigned_to = ?
     ORDER BY deadline IS NULL, deadline ASC, created_at DESC
     LIMIT 5`,
    [internId]
  );

  return {
    profile: profileRows[0]
      ? {
          ...profileRows[0],
          bank_account_masked: profileRows[0].bank_account_last4
            ? `XXXXXXXX${profileRows[0].bank_account_last4}`
            : null,
        }
      : null,
    profileCompletion: getProfileCompletion(profileRows[0]),
    todayAttendance: todayRows[0] || null,
    attendance: attendanceRows,
    reports,
    tasks,
  };
}

export async function updateInternProfile(internId: number, body: any) {
  await ensureInternshipSchema();
  const accountNumber = normalizeBankAccountNumber(body.bank_account_number);
  const encryptedAccountNumber = accountNumber ? encryptSensitiveValue(accountNumber) : null;
  const ifscCode = normalizeIfsc(body.bank_ifsc_code);

  await db.query(
    `UPDATE interns SET
       mobile=?, college=?, course=?, specialization=?, profile_photo=?, resume=?,
       aadhaar_card_document=?, cancelled_cheque_document=?,
       tenth_school=?, tenth_board=?, tenth_passing_year=?, tenth_percentage=?,
       twelfth_school=?, twelfth_board=?, twelfth_passing_year=?, twelfth_percentage=?,
       college_university=?, college_start_year=?, college_passing_year=?, college_percentage=?,
       bank_account_holder_name=?, bank_account_number_encrypted=COALESCE(?, bank_account_number_encrypted),
       bank_account_last4=COALESCE(?, bank_account_last4), bank_name=?, bank_ifsc_code=?, updated_at=NOW()
     WHERE id=?`,
    [
      clean(body.mobile),
      clean(body.college),
      clean(body.course),
      clean(body.specialization),
      clean(body.profile_photo),
      clean(body.resume),
      clean(body.aadhaar_card_document),
      clean(body.cancelled_cheque_document),
      clean(body.tenth_school),
      clean(body.tenth_board),
      cleanYear(body.tenth_passing_year, "10th passing year"),
      cleanPercentage(body.tenth_percentage, "10th percentage"),
      clean(body.twelfth_school),
      clean(body.twelfth_board),
      cleanYear(body.twelfth_passing_year, "12th passing year"),
      cleanPercentage(body.twelfth_percentage, "12th percentage"),
      clean(body.college_university),
      cleanYear(body.college_start_year, "College start year"),
      cleanYear(body.college_passing_year, "College passing year"),
      cleanPercentage(body.college_percentage, "College percentage"),
      clean(body.bank_account_holder_name),
      encryptedAccountNumber,
      accountNumber?.slice(-4) || null,
      clean(body.bank_name),
      ifscCode,
      internId,
    ]
  );
  await logInternAudit(internId, "profile_update", body.ip, body.user_agent, {
    updatedBankDetails: Boolean(accountNumber || ifscCode || body.bank_name),
    updatedDocuments: Boolean(body.aadhaar_card_document || body.cancelled_cheque_document || body.resume),
  });
  const [completionRows] = await db.query<any[]>(
    `SELECT mobile, college, course, specialization, resume, aadhaar_card_document, cancelled_cheque_document,
            tenth_school, tenth_board, tenth_passing_year, tenth_percentage, twelfth_school, twelfth_board,
            twelfth_passing_year, twelfth_percentage, college_university, college_start_year,
            college_passing_year, college_percentage, bank_account_holder_name,
            bank_account_number_encrypted, bank_name, bank_ifsc_code FROM interns WHERE id=? LIMIT 1`,
    [internId]
  );
  if (getProfileCompletion(completionRows[0]).complete) {
    await logInternAudit(internId, "profile_completed", body.ip, body.user_agent);
  }
}

const PRIVATE_DOCUMENT_COLUMNS = {
  aadhaar: "aadhaar_card_document",
  cancelled_cheque: "cancelled_cheque_document",
} as const;

export async function getInternPrivateDocument(internId: number, documentType: string): Promise<string | null> {
  await ensureInternshipSchema();
  const column = PRIVATE_DOCUMENT_COLUMNS[documentType as keyof typeof PRIVATE_DOCUMENT_COLUMNS];
  if (!column) {
    throw Object.assign(new Error("Invalid document type."), { status: 400 });
  }

  const [rows] = await db.query<any[]>(`SELECT ${column} AS document_key FROM interns WHERE id=? LIMIT 1`, [internId]);
  return rows[0]?.document_key || null;
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

export async function getOfficeNetwork() {
  await ensureInternshipSchema();
  const [rows] = await db.query<any[]>("SELECT office_ip, set_by, set_at FROM internship_attendance_settings WHERE id=1");
  return rows[0] || { office_ip: null, set_by: null, set_at: null };
}

export async function setOfficeNetwork(ip: string, setBy: string) {
  await ensureInternshipSchema();
  if (!ip) throw Object.assign(new Error("Could not detect your public IP."), { status: 400 });

  await db.query(
    `INSERT INTO internship_attendance_settings (id, office_ip, set_by, set_at)
     VALUES (1, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE office_ip=VALUES(office_ip), set_by=VALUES(set_by), set_at=NOW()`,
    [ip, setBy]
  );
}

export async function unsetOfficeNetwork() {
  await ensureInternshipSchema();
  await db.query("DELETE FROM internship_attendance_settings WHERE id=1");
}

export async function assertAttendanceIpAllowed(ip: string) {
  await ensureInternshipSchema();
  const [rows] = await db.query<any[]>("SELECT office_ip FROM internship_attendance_settings WHERE id=1");
  const officeIp = rows[0]?.office_ip;

  if (officeIp) {
    if (ip !== officeIp) {
      throw Object.assign(new Error("Attendance is allowed only from the office network."), { status: 403 });
    }
    return;
  }

  const allowed = (process.env.INTERNSHIP_ATTENDANCE_IPS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (allowed.length && !allowed.includes(ip)) {
    throw Object.assign(new Error("Attendance is allowed only from approved office networks."), { status: 403 });
  }
}

export async function internCheckIn(internId: number, ip: string, lateReason?: string) {
  await ensureInternshipSchema();
  await assertAttendanceIpAllowed(ip);
  await assertProfileComplete(internId);
  await assertPasswordReady(internId);

  const [existing] = await db.query<any[]>(
    "SELECT id, check_in FROM intern_attendance WHERE intern_id=? AND attendance_date=CURRENT_DATE() LIMIT 1",
    [internId]
  );

  if (existing.length && existing[0].check_in) {
    throw Object.assign(new Error("You are already checked in for today."), { status: 409 });
  }

  const lateAfter = process.env.INTERNSHIP_LATE_AFTER || "10:30:00";
  const [[{ nowTime }]] = await db.query<any[]>("SELECT CURRENT_TIME() AS nowTime");
  const isLate = String(nowTime) > lateAfter;
  const reason = clean(lateReason);

  if (isLate && !reason) {
    throw Object.assign(
      new Error(`You're checking in after ${lateAfter.slice(0, 5)}. Please add a reason for arriving late — it will be sent for verification.`),
      { status: 422, code: "LATE_REASON_REQUIRED" }
    );
  }

  const status = isLate ? "Late" : "Present";
  const verificationStatus = isLate ? "Pending" : "Approved";
  const remarks = [ip ? `Check-in IP: ${ip}` : null].filter(Boolean).join(" ") || null;

  await db.query(
    `INSERT INTO intern_attendance (intern_id, attendance_date, check_in, work_mode, status, remarks, late_reason, verification_status)
     VALUES (?, CURRENT_DATE(), CURRENT_TIME(), 'Office', ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       check_in = COALESCE(check_in, CURRENT_TIME()),
       status = IF(status = 'Absent', VALUES(status), status),
       late_reason = VALUES(late_reason),
       verification_status = VALUES(verification_status),
       updated_at = NOW()`,
    [internId, status, remarks, isLate ? reason : null, verificationStatus]
  );
  await logInternAudit(internId, "check_in", ip);
}

export async function internCheckOut(internId: number, ip: string, confirmHalfDay?: boolean) {
  await ensureInternshipSchema();
  await assertAttendanceIpAllowed(ip);
  await assertProfileComplete(internId);
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

  const earlyBefore = process.env.INTERNSHIP_EARLY_CHECKOUT_BEFORE || "17:30:00";
  const [[{ nowTime }]] = await db.query<any[]>("SELECT CURRENT_TIME() AS nowTime");
  const isEarly = String(nowTime) < earlyBefore;

  if (isEarly && !confirmHalfDay) {
    throw Object.assign(
      new Error(`It's before ${earlyBefore.slice(0, 5)}. Checking out now will mark today as a Half Day.`),
      { status: 422, code: "EARLY_CHECKOUT_CONFIRM" }
    );
  }

  await db.query(
    `UPDATE intern_attendance
     SET check_out=CURRENT_TIME(), status=IF(?, 'Half Day', status), updated_at=NOW()
     WHERE intern_id=? AND attendance_date=CURRENT_DATE()`,
    [isEarly ? 1 : 0, internId]
  );
  await logInternAudit(internId, "check_out", ip);
}

export async function verifyAttendance(id: string, status: "Approved" | "Rejected", verifiedBy: string) {
  await ensureInternshipSchema();
  if (!["Approved", "Rejected"].includes(status)) {
    throw Object.assign(new Error("Invalid verification status."), { status: 400 });
  }
  await db.query(
    `UPDATE intern_attendance SET verification_status=?, verified_by=?, verified_at=NOW(), updated_at=NOW() WHERE id=?`,
    [status, verifiedBy, id]
  );
}

export async function requestInternLeave(internId: number, body: any) {
  await ensureInternshipSchema();
  const startDate = clean(body.start_date);
  const endDate = clean(body.end_date) || startDate;
  if (!startDate) throw Object.assign(new Error("Start date is required."), { status: 400 });
  if (endDate! < startDate) throw Object.assign(new Error("End date cannot be before start date."), { status: 400 });

  await db.query(
    `INSERT INTO intern_leaves (intern_id, start_date, end_date, reason, status)
     VALUES (?, ?, ?, ?, 'Pending')`,
    [internId, startDate, endDate, clean(body.reason)]
  );
  await logInternAudit(internId, "leave_requested");
}

export async function getInternLeaves(internId: number) {
  await ensureInternshipSchema();
  const [rows] = await db.query<any[]>(
    "SELECT * FROM intern_leaves WHERE intern_id=? ORDER BY start_date DESC LIMIT 100",
    [internId]
  );
  return rows;
}

export async function listLeaves() {
  await ensureInternshipSchema();
  const [rows] = await db.query<any[]>(`
    SELECT l.*, i.full_name, i.intern_id AS intern_code
    FROM intern_leaves l
    JOIN interns i ON i.id = l.intern_id
    ORDER BY l.created_at DESC
    LIMIT 200
  `);
  return rows;
}

export async function reviewLeave(id: string, status: "Approved" | "Rejected", reviewedBy: string) {
  await ensureInternshipSchema();
  if (!["Approved", "Rejected"].includes(status)) {
    throw Object.assign(new Error("Invalid leave status."), { status: 400 });
  }
  await db.query(
    `UPDATE intern_leaves SET status=?, reviewed_by=?, reviewed_at=NOW(), updated_at=NOW() WHERE id=?`,
    [status, reviewedBy, id]
  );
}

export async function listHolidays() {
  await ensureInternshipSchema();
  const [rows] = await db.query<any[]>("SELECT * FROM internship_holidays ORDER BY holiday_date ASC");
  return rows;
}

export async function addHoliday(body: any) {
  await ensureInternshipSchema();
  const holidayDate = clean(body.holiday_date);
  if (!holidayDate) throw Object.assign(new Error("Holiday date is required."), { status: 400 });
  if (!clean(body.name)) throw Object.assign(new Error("Holiday name is required."), { status: 400 });

  await db.query(
    `INSERT INTO internship_holidays (holiday_date, name) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE name=VALUES(name)`,
    [holidayDate, body.name.trim()]
  );
}

export async function deleteHoliday(id: string) {
  await ensureInternshipSchema();
  await db.query("DELETE FROM internship_holidays WHERE id=?", [id]);
}

export async function getInternCalendar(internId: number, year: number, month: number) {
  await ensureInternshipSchema();
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;

  const [attendanceRows] = await db.query<any[]>(
    `SELECT attendance_date, status FROM intern_attendance
     WHERE intern_id=? AND attendance_date >= ? AND attendance_date < DATE_ADD(?, INTERVAL 1 MONTH)`,
    [internId, monthStart, monthStart]
  );

  const [leaveRows] = await db.query<any[]>(
    `SELECT start_date, end_date FROM intern_leaves
     WHERE intern_id=? AND status='Approved'
       AND start_date < DATE_ADD(?, INTERVAL 1 MONTH) AND end_date >= ?`,
    [internId, monthStart, monthStart]
  );

  const [holidayRows] = await db.query<any[]>(
    `SELECT holiday_date, name FROM internship_holidays
     WHERE holiday_date >= ? AND holiday_date < DATE_ADD(?, INTERVAL 1 MONTH)`,
    [monthStart, monthStart]
  );

  const codeByStatus: Record<string, string> = { Present: "P", Late: "L", Absent: "A", "Half Day": "H" };
  const days: Record<string, { code: string | null; label: string }> = {};

  for (const row of attendanceRows) {
    const dateKey = toDateKey(row.attendance_date);
    days[dateKey] = { code: codeByStatus[row.status] || null, label: row.status };
  }

  for (const row of leaveRows) {
    let cursor = new Date(row.start_date);
    const end = new Date(row.end_date);
    while (cursor <= end) {
      const dateKey = cursor.toISOString().slice(0, 10);
      if (dateKey >= monthStart) days[dateKey] = { code: "OL", label: "On Leave" };
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  for (const row of holidayRows) {
    const dateKey = toDateKey(row.holiday_date);
    days[dateKey] = { code: null, label: row.name };
  }

  return { year, month, days };
}

export async function createInternSelfReport(internId: number, body: any) {
  await ensureInternshipSchema();
  await assertProfileComplete(internId);
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
  await assertProfileComplete(internId);
  await assertPasswordReady(internId);
  const progress = Math.max(0, Math.min(100, Number(body.progress || 0)));
  const status = progress === 100 ? "Completed" : progress > 0 ? "In Progress" : "Pending";

  await db.query(
    "UPDATE intern_tasks SET progress=?, status=?, updated_at=NOW() WHERE id=? AND assigned_to=?",
    [progress, status, taskId, internId]
  );
  await logInternAudit(internId, "task_progress_update", undefined, undefined, { taskId, progress, status });
}

export async function getInternHistory(internId: number, type: "reports" | "tasks" | "attendance") {
  await ensureInternshipSchema();
  await assertProfileComplete(internId);
  if (type === "reports") {
    const [rows] = await db.query<any[]>(
      "SELECT * FROM intern_work_reports WHERE intern_id=? ORDER BY report_date DESC LIMIT 200",
      [internId]
    );
    return { rows };
  }
  if (type === "tasks") {
    const [rows] = await db.query<any[]>(
      "SELECT * FROM intern_tasks WHERE assigned_to=? ORDER BY deadline IS NULL, deadline ASC, created_at DESC LIMIT 200",
      [internId]
    );
    return { rows };
  }
  const [rows] = await db.query<any[]>(
    `SELECT *, CASE WHEN check_in IS NOT NULL AND check_out IS NOT NULL
       THEN ROUND(TIME_TO_SEC(TIMEDIFF(check_out, check_in)) / 3600, 2) ELSE NULL END AS working_hours
     FROM intern_attendance WHERE intern_id=? ORDER BY attendance_date DESC LIMIT 200`,
    [internId]
  );
  const present = rows.filter((row) => row.status !== "Absent");
  return {
    rows,
    summary: {
      totalDays: rows.length,
      presentDays: present.length,
      absentDays: rows.filter((row) => row.status === "Absent").length,
      totalHours: Number(rows.reduce((sum, row) => sum + Number(row.working_hours || 0), 0).toFixed(2)),
    },
  };
}

export async function getInternReport(internId: number, reportId: string) {
  await ensureInternshipSchema();
  await assertProfileComplete(internId);
  const [rows] = await db.query<any[]>(
    `SELECT r.*, i.full_name, i.intern_id AS intern_code, i.role
     FROM intern_work_reports r JOIN interns i ON i.id=r.intern_id
     WHERE r.id=? AND r.intern_id=? LIMIT 1`,
    [reportId, internId]
  );
  if (!rows.length) throw Object.assign(new Error("Report not found."), { status: 404 });
  await logInternAudit(internId, "report_pdf_download", undefined, undefined, { reportId });
  return rows[0];
}

export async function getCertificateSettings() {
  await ensureInternshipSchema();
  const [rows] = await db.query<any[]>("SELECT * FROM intern_certificate_settings WHERE id=1 LIMIT 1");
  return rows[0] || { signature_image: "", signer_name: "", signer_designation: "" };
}

export async function updateCertificateSettings(body: any) {
  await ensureInternshipSchema();
  await db.query(
    `INSERT INTO intern_certificate_settings (id, signature_image, signer_name, signer_designation)
     VALUES (1, ?, ?, ?)
     ON DUPLICATE KEY UPDATE signature_image=VALUES(signature_image), signer_name=VALUES(signer_name),
       signer_designation=VALUES(signer_designation)`,
    [clean(body.signature_image), clean(body.signer_name), clean(body.signer_designation)]
  );
}

export async function issueCertificate(internId: string, adminId?: number) {
  await ensureInternshipSchema();
  const [internRows] = await db.query<any[]>(
    `SELECT i.id, i.full_name, i.role, i.start_date, i.end_date, i.status, m.name AS mentor_name
     FROM interns i LEFT JOIN internship_mentors m ON m.id=i.mentor_id WHERE i.id=? LIMIT 1`,
    [internId]
  );
  const intern = internRows[0];
  if (!intern) throw Object.assign(new Error("Intern not found."), { status: 404 });
  if (intern.status !== "Completed") {
    throw Object.assign(new Error("Certificates can be issued only after the internship is completed."), { status: 400 });
  }
  const [existing] = await db.query<any[]>(
    "SELECT id FROM intern_certificates WHERE intern_id=? AND status='Issued' LIMIT 1",
    [internId]
  );
  if (existing.length) throw Object.assign(new Error("An active certificate has already been issued for this intern."), { status: 409 });

  const settings = await getCertificateSettings();
  if (!settings.signature_image || !settings.signer_name) {
    throw Object.assign(new Error("Configure certificate signature and signer name before issuing."), { status: 400 });
  }
  const certificateId = `DMI-CERT-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const verificationToken = crypto.randomBytes(24).toString("hex");
  const [result] = await db.query<any>(
    `INSERT INTO intern_certificates
     (intern_id, certificate_id, verification_token, issued_at, intern_name, role, start_date, end_date,
      mentor_name, signature_image, signer_name, signer_designation, issued_by_admin_id)
     VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [intern.id, certificateId, verificationToken, intern.full_name, intern.role, intern.start_date, intern.end_date,
      intern.mentor_name, settings.signature_image, settings.signer_name, settings.signer_designation, adminId || null]
  );
  await logInternAudit(intern.id, "certificate_issued", undefined, undefined, { certificateId, adminId });
  return { id: result.insertId, certificate_id: certificateId };
}

export async function getAdminCertificates() {
  await ensureInternshipSchema();
  const [rows] = await db.query<any[]>(
    "SELECT * FROM intern_certificates ORDER BY issued_at DESC LIMIT 300"
  );
  return rows;
}

export async function revokeCertificate(certificateId: string, reason?: string) {
  await ensureInternshipSchema();
  const [certificateRows] = await db.query<any[]>("SELECT intern_id FROM intern_certificates WHERE id=? LIMIT 1", [certificateId]);
  const [result] = await db.query<any>(
    "UPDATE intern_certificates SET status='Revoked', revoked_at=NOW(), revoked_reason=? WHERE id=? AND status='Issued'",
    [clean(reason), certificateId]
  );
  if (!result.affectedRows) throw Object.assign(new Error("Active certificate not found."), { status: 404 });
  await logInternAudit(certificateRows[0]?.intern_id || null, "certificate_revoked", undefined, undefined, { certificateId, reason: clean(reason) });
}

export async function getInternCertificates(internId: number) {
  await ensureInternshipSchema();
  await assertProfileComplete(internId);
  const [rows] = await db.query<any[]>(
    "SELECT id, certificate_id, status, issued_at, revoked_at, revoked_reason FROM intern_certificates WHERE intern_id=? ORDER BY issued_at DESC",
    [internId]
  );
  return rows;
}

export async function getCertificateForDownload(certificateId: string, internId?: number) {
  await ensureInternshipSchema();
  const params: any[] = [certificateId];
  let where = "certificate_id=?";
  if (internId) { where += " AND intern_id=?"; params.push(internId); }
  const [rows] = await db.query<any[]>(`SELECT * FROM intern_certificates WHERE ${where} LIMIT 1`, params);
  if (!rows.length) throw Object.assign(new Error("Certificate not found."), { status: 404 });
  await logInternAudit(rows[0].intern_id, "certificate_pdf_download", undefined, undefined, { certificateId: rows[0].certificate_id });
  return rows[0];
}

export async function verifyCertificate(value: string) {
  await ensureInternshipSchema();
  const [rows] = await db.query<any[]>(
    `SELECT certificate_id, verification_token, status, intern_name, role, start_date, end_date, issued_at
     FROM intern_certificates WHERE certificate_id=? OR verification_token=? LIMIT 1`,
    [value?.trim(), value?.trim()]
  );
  if (!rows.length) return { valid: false };
  const certificate = rows[0];
  return {
    valid: certificate.status === "Issued",
    certificate: certificate.status === "Issued" ? certificate : { certificate_id: certificate.certificate_id, status: "Revoked" },
  };
}

export const internRequestIp = getRequesterIp;
