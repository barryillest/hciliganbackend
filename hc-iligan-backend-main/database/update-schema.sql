-- Update script to add admin features to existing database
-- Run this if you already have the database and just need to add new features

USE hc_iligan_db;

-- Add role column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user';

-- Update admin user to have admin role
UPDATE users SET role = 'admin' WHERE username = 'admin';

-- Update all products with image URLs
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' WHERE name = 'Cement';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1624948465027-6f3cf4b18e50?w=400' WHERE name = 'Sand';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400' WHERE name = 'Gravel';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1615971928249-f6f0c79d0e62?w=400' WHERE name = 'Hollow Blocks';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400' WHERE name = 'Steel Bars';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' WHERE name = 'Paint';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400' WHERE name = 'Tiles';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400' WHERE name = 'Electrical Wire';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400' WHERE name = 'PVC Pipe';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400' WHERE name = 'Roofing Sheet';

-- Verify changes
SELECT 'Users with admin role:' as info;
SELECT username, email, role FROM users WHERE role = 'admin';

SELECT 'Products with images:' as info;
SELECT id, name, category, SUBSTRING(image_url, 1, 50) as image_preview FROM products LIMIT 5;

SELECT 'Update complete!' as status;
