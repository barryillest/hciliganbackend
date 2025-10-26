const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const adminAuthMiddleware = require('../middleware/adminAuth');
const authMiddleware = require('../middleware/auth');

// Public routes (anyone can view products)
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProduct);

// Stock management routes (authenticated users)
router.post('/reserve-stock', authMiddleware, productController.reserveStock);
router.post('/release-stock', authMiddleware, productController.releaseStock);
router.post('/batch-release-stock', authMiddleware, productController.batchReleaseStock);

// Admin-only routes (require admin authentication)
router.post('/', adminAuthMiddleware, productController.createProduct);
router.put('/:id', adminAuthMiddleware, productController.updateProduct);
router.delete('/:id', adminAuthMiddleware, productController.deleteProduct);

module.exports = router;
