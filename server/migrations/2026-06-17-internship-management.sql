CREATE TABLE IF NOT EXISTS internship_mentors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(180) NULL,
  department VARCHAR(120) NULL,
  designation VARCHAR(140) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internship_batches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_name VARCHAR(160) NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  mode ENUM('Remote','Onsite','Hybrid') DEFAULT 'Hybrid',
  status ENUM('Upcoming','Active','Completed','Paused') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internship_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  client VARCHAR(160) NULL,
  technology VARCHAR(180) NULL,
  mentor_id INT NULL,
  status ENUM('Planned','Active','Completed','Paused') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
);

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
);

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
);

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
);

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
);

CREATE TABLE IF NOT EXISTS intern_password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intern_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_intern_reset_token (token_hash),
  INDEX idx_intern_reset_intern (intern_id)
);

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
);
