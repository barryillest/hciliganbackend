const bcrypt = require('bcrypt');

const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  console.log('Password:', password);
  console.log('Bcrypt Hash:', hash);
  console.log('\nUse this hash in your SQL INSERT statements');
});
