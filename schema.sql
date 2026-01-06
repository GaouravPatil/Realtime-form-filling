-- Table creation script for MySQL / PostgreSQL

CREATE TABLE IF NOT EXISTS form_submissions (
    id SERIAL PRIMARY KEY, -- Use AUTO_INCREMENT for MySQL
    full_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    skills VARCHAR(255) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: For MySQL, replace 'SERIAL PRIMARY KEY' with 'INT AUTO_INCREMENT PRIMARY KEY'
-- and 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' works in both (MySQL 5.6+).
