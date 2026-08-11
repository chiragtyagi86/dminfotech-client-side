-- Leave requests + holiday calendar for the intern attendance calendar view.
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
);

CREATE TABLE IF NOT EXISTS internship_holidays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  holiday_date DATE NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
