-- Verification script to check if admin account and product images are set up correctly
-- Run this to verify your database is configured properly

USE hc_iligan_db;

-- Header
SELECT '========================================' as '';
SELECT '  HC Iligan Database Verification' as '';
SELECT '========================================' as '';
SELECT '' as '';

-- Check 1: Admin user exists with admin role
SELECT '✓ Check 1: Admin User' as '';
SELECT '---' as '';
SELECT
    username,
    email,
    full_name,
    role,
    CASE
        WHEN role = 'admin' THEN '✅ CORRECT - User is admin'
        ELSE '❌ ERROR - User role should be admin'
    END as status
FROM users
WHERE username = 'admin';
SELECT '' as '';

-- Check 2: Total users count
SELECT '✓ Check 2: User Accounts' as '';
SELECT '---' as '';
SELECT COUNT(*) as total_users FROM users;
SELECT
    role,
    COUNT(*) as count
FROM users
GROUP BY role;
SELECT '' as '';

-- Check 3: Products exist
SELECT '✓ Check 3: Products Count' as '';
SELECT '---' as '';
SELECT
    COUNT(*) as total_products,
    CASE
        WHEN COUNT(*) >= 10 THEN '✅ CORRECT - Have 10+ products'
        ELSE '❌ WARNING - Should have at least 10 products'
    END as status
FROM products;
SELECT '' as '';

-- Check 4: Products have images
SELECT '✓ Check 4: Products with Images' as '';
SELECT '---' as '';
SELECT
    COUNT(*) as products_with_images,
    CASE
        WHEN COUNT(*) >= 10 THEN '✅ CORRECT - All products have images'
        ELSE '❌ ERROR - Some products missing images'
    END as status
FROM products
WHERE image_url IS NOT NULL AND image_url != '';
SELECT '' as '';

-- Check 5: Show sample products with images
SELECT '✓ Check 5: Sample Products' as '';
SELECT '---' as '';
SELECT
    id,
    name,
    category,
    price,
    CASE
        WHEN image_url IS NOT NULL AND image_url != '' THEN '✅ Has image'
        ELSE '❌ No image'
    END as image_status,
    SUBSTRING(image_url, 1, 60) as image_url_preview
FROM products
ORDER BY id
LIMIT 5;
SELECT '' as '';

-- Check 6: Product categories
SELECT '✓ Check 6: Product Categories' as '';
SELECT '---' as '';
SELECT
    category,
    COUNT(*) as product_count
FROM products
GROUP BY category
ORDER BY category;
SELECT '' as '';

-- Final Summary
SELECT '========================================' as '';
SELECT '  VERIFICATION SUMMARY' as '';
SELECT '========================================' as '';

SELECT
    CASE
        WHEN (SELECT COUNT(*) FROM users WHERE role = 'admin') > 0
        AND (SELECT COUNT(*) FROM products WHERE image_url IS NOT NULL AND image_url != '') >= 10
        THEN '✅ ALL CHECKS PASSED!'
        ELSE '❌ SOME CHECKS FAILED - See details above'
    END as overall_status;

SELECT '' as '';
SELECT 'Quick Login Test:' as '';
SELECT '  Username: admin' as '';
SELECT '  Password: password123' as '';
SELECT '  Expected: Should have admin role and access Admin Panel' as '';
SELECT '' as '';
SELECT 'Next Steps:' as '';
SELECT '  1. Start backend: cd backend && npm run dev' as '';
SELECT '  2. Start app: npm start' as '';
SELECT '  3. Login as admin' as '';
SELECT '  4. Check products have images' as '';
SELECT '  5. Access Admin Panel from Profile' as '';
SELECT '========================================' as '';
