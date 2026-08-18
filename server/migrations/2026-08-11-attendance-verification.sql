-- Late check-in reason capture + higher-authority verification, early check-out half-day flag.
-- Run only if these columns don't already exist (no IF NOT EXISTS support on this MySQL version).
ALTER TABLE intern_attendance
  ADD COLUMN late_reason TEXT NULL,
  ADD COLUMN verification_status ENUM('Approved','Pending','Rejected') DEFAULT 'Approved',
  ADD COLUMN verified_by VARCHAR(180) NULL,
  ADD COLUMN verified_at DATETIME NULL;
