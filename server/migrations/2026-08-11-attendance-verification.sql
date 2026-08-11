-- Late check-in reason capture + higher-authority verification, early check-out half-day flag.
ALTER TABLE intern_attendance
  ADD COLUMN IF NOT EXISTS late_reason TEXT NULL,
  ADD COLUMN IF NOT EXISTS verification_status ENUM('Approved','Pending','Rejected') DEFAULT 'Approved',
  ADD COLUMN IF NOT EXISTS verified_by VARCHAR(180) NULL,
  ADD COLUMN IF NOT EXISTS verified_at DATETIME NULL;
