const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetPassword(email, newPassword) {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Generate hash
    const hash = await bcrypt.hash(newPassword, 10);
    console.log(`Generated hash: ${hash.substring(0, 30)}...`);

    // Update password using parameterized query (safer)
    const [result] = await conn.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hash, email]
    );

    if (result.affectedRows > 0) {
      console.log(`✓ Password updated successfully for ${email}`);

      // Verify the update
      const [users] = await conn.query('SELECT username, email FROM users WHERE email = ?', [email]);
      if (users.length > 0) {
        console.log(`✓ User: ${users[0].username} (${users[0].email})`);

        // Test the password
        const [passwordCheck] = await conn.query('SELECT password FROM users WHERE email = ?', [email]);
        const isValid = await bcrypt.compare(newPassword, passwordCheck[0].password);
        console.log(`✓ Password validation: ${isValid ? 'SUCCESS' : 'FAILED'}`);
      }
    } else {
      console.log(`✗ No user found with email: ${email}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await conn.end();
  }
}

// Reset password for the user
const email = process.argv[2] || 'johnbarryortega@gmail.com';
const password = process.argv[3] || 'password123';

console.log(`Resetting password for ${email}...`);
resetPassword(email, password);
