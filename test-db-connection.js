const db = require('./config/database');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('========================================');
    console.log('Testing Database Connection...');
    console.log('========================================');
    console.log('Config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD ? '***' : '(empty)'
    });
    console.log('');

    // Test connection
    const [rows] = await db.query('SELECT 1 + 1 as result');
    console.log('✓ Database connection successful!');
    console.log('');

    // Check if users table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.log('✗ ERROR: users table does not exist!');
      console.log('');
      console.log('Please run: mysql -u root < backend/database/schema.sql');
      process.exit(1);
    }
    console.log('✓ users table exists');
    console.log('');

    // Check users
    const [users] = await db.query('SELECT id, username, email, role FROM users');
    console.log(`✓ Found ${users.length} users in database:`);
    console.log('');
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - Role: ${user.role}`);
    });

    if (users.length === 0) {
      console.log('');
      console.log('✗ ERROR: No users in database!');
      console.log('Please run: mysql -u root < backend/database/schema.sql');
      process.exit(1);
    }

    console.log('');
    console.log('========================================');
    console.log('Database is ready!');
    console.log('========================================');
    console.log('');
    console.log('Login credentials:');
    console.log('  Username: admin');
    console.log('  Password: password123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('✗ Database error:', error.message);
    console.error('');
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('Database "hc_iligan_db" does not exist!');
      console.error('Please run: mysql -u root < backend/database/schema.sql');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied! Check DB_USER and DB_PASSWORD in .env file');
    } else {
      console.error('Full error:', error);
    }
    process.exit(1);
  }
}

testConnection();
