const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function fixDatabase() {
  let connection;

  try {
    console.log('========================================');
    console.log('Fixing Database Schema...');
    console.log('========================================');
    console.log('');

    // Connect without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✓ Connected to MySQL');

    // Drop and recreate database
    await connection.query('DROP DATABASE IF EXISTS hc_iligan_db');
    console.log('✓ Dropped old database');

    await connection.query('CREATE DATABASE hc_iligan_db');
    console.log('✓ Created new database');

    await connection.query('USE hc_iligan_db');
    console.log('✓ Using hc_iligan_db');
    console.log('');

    // Create users table
    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        phone VARCHAR(20),
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created users table');

    // Create products table
    await connection.query(`
      CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        unit VARCHAR(50),
        price DECIMAL(10, 2),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created products table');

    // Create projects table
    await connection.query(`
      CREATE TABLE projects (
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
      )
    `);
    console.log('✓ Created projects table');

    // Create project_items table
    await connection.query(`
      CREATE TABLE project_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        product_id INT,
        product_name VARCHAR(255),
        quantity DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(50),
        unit_price DECIMAL(10, 2),
        total_price DECIMAL(12, 2),
        notes TEXT,
        is_purchased BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Created project_items table');

    console.log('');
    console.log('Creating sample users...');
    console.log('');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert sample users
    const users = [
      ['admin', 'admin@hciligan.com', 'Admin User', '09123456789', 'admin'],
      ['juan', 'juan.delacruz@gmail.com', 'Juan Dela Cruz', '09171234567', 'user'],
      ['maria', 'maria.santos@gmail.com', 'Maria Santos', '09187654321', 'user'],
      ['pedro', 'pedro.garcia@yahoo.com', 'Pedro Garcia', '09191234567', 'user'],
      ['ana', 'ana.reyes@outlook.com', 'Ana Reyes', '09201234567', 'user']
    ];

    for (const [username, email, full_name, phone, role] of users) {
      await connection.query(
        'INSERT INTO users (username, email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name, phone, role]
      );
      console.log(`  ✓ Created user: ${username} (${email}) - Role: ${role}`);
    }

    console.log('');
    console.log('========================================');
    console.log('SUCCESS! Database is ready!');
    console.log('========================================');
    console.log('');
    console.log('Login Credentials:');
    console.log('  Username: admin');
    console.log('  Password: password123');
    console.log('');
    console.log('Other test users: juan, maria, pedro, ana');
    console.log('All passwords: password123');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('✗ Error:', error.message);
    console.error('');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixDatabase();
