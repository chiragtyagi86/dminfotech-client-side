-- Admin-settable office IP for attendance restriction (replaces static INTERNSHIP_ATTENDANCE_IPS env var).
CREATE TABLE IF NOT EXISTS internship_attendance_settings (
  id TINYINT PRIMARY KEY,
  office_ip VARCHAR(64) NULL,
  set_by VARCHAR(180) NULL,
  set_at DATETIME NULL
);
