ALTER TABLE interns
  ADD COLUMN aadhaar_card_document VARCHAR(255) NULL,
  ADD COLUMN cancelled_cheque_document VARCHAR(255) NULL,
  ADD COLUMN tenth_school VARCHAR(180) NULL,
  ADD COLUMN tenth_board VARCHAR(140) NULL,
  ADD COLUMN tenth_passing_year SMALLINT NULL,
  ADD COLUMN tenth_percentage DECIMAL(5,2) NULL,
  ADD COLUMN twelfth_school VARCHAR(180) NULL,
  ADD COLUMN twelfth_board VARCHAR(140) NULL,
  ADD COLUMN twelfth_passing_year SMALLINT NULL,
  ADD COLUMN twelfth_percentage DECIMAL(5,2) NULL,
  ADD COLUMN college_university VARCHAR(180) NULL,
  ADD COLUMN college_start_year SMALLINT NULL,
  ADD COLUMN college_passing_year SMALLINT NULL,
  ADD COLUMN college_percentage DECIMAL(5,2) NULL,
  ADD COLUMN bank_account_holder_name VARCHAR(180) NULL,
  ADD COLUMN bank_account_number_encrypted TEXT NULL,
  ADD COLUMN bank_account_last4 CHAR(4) NULL,
  ADD COLUMN bank_name VARCHAR(180) NULL,
  ADD COLUMN bank_ifsc_code VARCHAR(11) NULL;

CREATE TABLE IF NOT EXISTS intern_certificate_settings (
  id TINYINT PRIMARY KEY,
  signature_image VARCHAR(255) NULL,
  signer_name VARCHAR(160) NULL,
  signer_designation VARCHAR(160) NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
);
