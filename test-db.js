const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Environment variables:');
  console.log(`DB_HOST: ${process.env.DB_HOST || 'not set'}`);
  console.log(`DB_USER: ${process.env.DB_USER || 'not set'}`);
  console.log(`DB_NAME: ${process.env.DB_NAME || 'not set'}`);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('Successfully connected to MySQL database!');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Test query result:', rows);
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error number:', error.errno);
    process.exit(1);
  }
}

testConnection();
