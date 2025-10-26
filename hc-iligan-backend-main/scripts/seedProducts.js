const mysql = require('mysql2/promise');
require('dotenv').config();

const products = [
  {
    id: 1,
    name: 'Portland Cement 40kg',
    description: 'High-quality Portland cement for construction projects',
    category: 'Building Materials',
    unit: 'bag',
    price: 285,
    store: 'Wilcon Depot',
    image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400'
  },
  {
    id: 2,
    name: 'Rebar 10mm x 6m',
    description: 'Deformed steel bar for concrete reinforcement',
    category: 'Steel & Metal',
    unit: 'piece',
    price: 420,
    store: 'Wilcon Depot',
    image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400'
  },
  {
    id: 3,
    name: 'Hollow Blocks 4"',
    description: 'Standard concrete hollow blocks',
    category: 'Building Materials',
    unit: 'piece',
    price: 12,
    store: 'Wilcon Depot',
    image_url: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400'
  },
  {
    id: 4,
    name: 'Roofing Sheets GI 26GA',
    description: 'Galvanized iron roofing sheets',
    category: 'Roofing',
    unit: 'sheet',
    price: 850,
    store: 'Wilcon Depot',
    image_url: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400'
  },
  {
    id: 5,
    name: 'Paint - Interior White 4L',
    description: 'Premium interior wall paint',
    category: 'Paint & Finishes',
    unit: 'gallon',
    price: 1250,
    store: 'Wilcon Depot',
    image_url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400'
  },
  {
    id: 6,
    name: 'Electrical Wire 2.0mm',
    description: 'THHN electrical wire per meter',
    category: 'Electrical',
    unit: 'meter',
    price: 95,
    store: 'Wilcon Depot',
    image_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400'
  },
  {
    id: 7,
    name: 'PVC Pipe 4" x 3m',
    description: 'PVC sewer pipe for drainage',
    category: 'Plumbing',
    unit: 'piece',
    price: 185,
    store: 'Wilcon Depot',
    image_url: 'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=400'
  },
  {
    id: 8,
    name: 'Tiles - Ceramic 30x30cm',
    description: 'Ceramic floor tiles per piece',
    category: 'Tiles & Flooring',
    unit: 'piece',
    price: 45,
    store: 'Wilcon Depot',
    image_url: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400'
  }
];

async function seedProducts() {
  let connection;

  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hc_iligan_db'
    });

    console.log('Connected to database');
    console.log('Seeding products...\n');

    // Clear existing products
    await connection.query('DELETE FROM products');
    console.log('Cleared existing products');

    // Reset auto increment
    await connection.query('ALTER TABLE products AUTO_INCREMENT = 1');

    // Insert products
    for (const product of products) {
      const query = `
        INSERT INTO products (id, name, description, category, unit, price, image_url, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      await connection.query(query, [
        product.id,
        product.name,
        product.description,
        product.category,
        product.unit,
        product.price,
        product.image_url
      ]);

      console.log(`✓ Added: ${product.name} - ₱${product.price}`);
    }

    console.log(`\n✓ Successfully seeded ${products.length} products!`);

  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

seedProducts();
