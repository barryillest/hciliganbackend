-- Create database
CREATE DATABASE IF NOT EXISTS hc_iligan_db;
USE hc_iligan_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit VARCHAR(50),
  price DECIMAL(10, 2),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  budget DECIMAL(12, 2),
  status ENUM('planning', 'in_progress', 'completed', 'on_hold') DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Project items (shopping list items for a project)
CREATE TABLE IF NOT EXISTS project_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  product_id INT,
  custom_name VARCHAR(255),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2),
  notes TEXT,
  is_purchased BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product suppliers (many-to-many relationship)
CREATE TABLE IF NOT EXISTS product_suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  supplier_id INT NOT NULL,
  supplier_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_product_supplier (product_id, supplier_id)
);

-- Insert sample users
-- Password for all sample users is: password123
-- These are bcrypt hashed passwords with salt rounds = 10
INSERT INTO users (username, email, password, full_name, phone, role) VALUES
('admin', 'admin@hciligan.com', '$2b$10$K38/5w.uCooJuhB.kI7/7uHziFkhqQu4VMyBPYsR4YvN7X6SusWRS', 'Admin User', '09123456789', 'admin'),
('juan', 'juan.delacruz@gmail.com', '$2b$10$K38/5w.uCooJuhB.kI7/7uHziFkhqQu4VMyBPYsR4YvN7X6SusWRS', 'Juan Dela Cruz', '09171234567', 'user'),
('maria', 'maria.santos@gmail.com', '$2b$10$K38/5w.uCooJuhB.kI7/7uHziFkhqQu4VMyBPYsR4YvN7X6SusWRS', 'Maria Santos', '09187654321', 'user'),
('pedro', 'pedro.garcia@yahoo.com', '$2b$10$K38/5w.uCooJuhB.kI7/7uHziFkhqQu4VMyBPYsR4YvN7X6SusWRS', 'Pedro Garcia', '09191234567', 'user'),
('ana', 'ana.reyes@outlook.com', '$2b$10$K38/5w.uCooJuhB.kI7/7uHziFkhqQu4VMyBPYsR4YvN7X6SusWRS', 'Ana Reyes', '09201234567', 'user');

-- Insert sample products with images
INSERT INTO products (name, description, category, unit, price, image_url) VALUES
('Cement', 'Portland Cement 40kg', 'Building Materials', 'bag', 250.00, 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400'),
('Sand', 'Fine Sand', 'Building Materials', 'cubic meter', 800.00, 'https://images.unsplash.com/photo-1624948465027-6f3cf4b18e50?w=400'),
('Gravel', 'Crushed Gravel', 'Building Materials', 'cubic meter', 900.00, 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400'),
('Hollow Blocks', 'Standard 4-inch Hollow Blocks', 'Building Materials', 'piece', 12.00, 'https://images.unsplash.com/photo-1615971928249-f6f0c79d0e62?w=400'),
('Steel Bars', '10mm Steel Reinforcement Bars', 'Building Materials', 'piece', 150.00, 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400'),
('Paint', 'Exterior Wall Paint', 'Finishing', 'gallon', 850.00, 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400'),
('Tiles', 'Ceramic Floor Tiles 60x60cm', 'Finishing', 'box', 450.00, 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400'),
('Electrical Wire', '2.0mm THHN Wire', 'Electrical', 'meter', 25.00, 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400'),
('PVC Pipe', '4-inch PVC Pipe', 'Plumbing', 'meter', 120.00, 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400'),
('Roofing Sheet', 'Galvanized Iron Roofing Sheet', 'Roofing', 'piece', 380.00, 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400');
