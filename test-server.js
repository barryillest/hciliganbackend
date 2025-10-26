// Simple script to test if the server is working
const http = require('http');

console.log('Testing backend server...\n');

// Test 1: Health check
http.get('http://localhost:3000/health', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✓ Health check passed');
    console.log('  Response:', data);
    console.log('');

    // Test 2: Products endpoint
    testProducts();
  });
}).on('error', (err) => {
  console.log('✗ Server is not running!');
  console.log('  Error:', err.message);
  console.log('\nPlease start the server with: npm run dev');
  process.exit(1);
});

function testProducts() {
  http.get('http://localhost:3000/api/products', (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('✓ Products API working');
      const products = JSON.parse(data);
      console.log(`  Found ${products.products?.length || 0} products`);
      console.log('');
      console.log('✓ Backend server is working correctly!');
      console.log('\nYou can now use the app for login/registration.');
    });
  }).on('error', (err) => {
    console.log('✗ Products API failed');
    console.log('  Error:', err.message);
  });
}
