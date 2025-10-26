const db = require('../config/database');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY name ASC';

    const [products] = await db.query(query, params);
    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: products[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, unit, price, image_url, stock = 100 } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const [result] = await db.query(
      'INSERT INTO products (name, description, category, unit, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, category, unit, price, stock, image_url]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: {
        id: result.insertId,
        name,
        description,
        category,
        unit,
        price,
        stock,
        image_url
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, unit, price, stock, image_url } = req.body;

    const [result] = await db.query(
      'UPDATE products SET name = ?, description = ?, category = ?, unit = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
      [name, description, category, unit, price, stock || 100, image_url, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Get product categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT DISTINCT category FROM products ORDER BY category');
    res.json({ categories: categories.map(c => c.category) });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Reserve stock (when adding to cart)
exports.reserveStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Product ID and valid quantity are required' });
    }

    // Check current stock
    const [products] = await db.query('SELECT stock FROM products WHERE id = ?', [productId]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentStock = products[0].stock;

    if (currentStock < quantity) {
      return res.status(400).json({
        error: 'Insufficient stock',
        availableStock: currentStock
      });
    }

    // Deduct stock
    await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, productId]);

    res.json({
      message: 'Stock reserved successfully',
      newStock: currentStock - quantity
    });
  } catch (error) {
    console.error('Reserve stock error:', error);
    res.status(500).json({ error: 'Failed to reserve stock' });
  }
};

// Release stock (when removing from cart or clearing cart)
exports.releaseStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Product ID and valid quantity are required' });
    }

    // Return stock
    await db.query('UPDATE products SET stock = stock + ? WHERE id = ?', [quantity, productId]);

    res.json({ message: 'Stock released successfully' });
  } catch (error) {
    console.error('Release stock error:', error);
    res.status(500).json({ error: 'Failed to release stock' });
  }
};

// Batch release stock (for clearing cart)
exports.batchReleaseStock = async (req, res) => {
  try {
    const { items } = req.body; // items = [{productId, quantity}]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    // Release stock for each item
    for (const item of items) {
      await db.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.productId]);
    }

    res.json({ message: 'Stock released for all items successfully' });
  } catch (error) {
    console.error('Batch release stock error:', error);
    res.status(500).json({ error: 'Failed to release stock' });
  }
};
