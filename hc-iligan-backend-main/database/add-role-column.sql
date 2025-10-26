-- Add role column to users table if it doesn't exist
USE hc_iligan_db;

-- Add role column
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user'
AFTER phone;

-- Update admin user to have admin role
UPDATE users
SET role = 'admin'
WHERE username = 'admin' OR email = 'admin@hciligan.com';

-- Show all users
SELECT id, username, email, role FROM users;
