const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

// Upload image route (protected, admin only recommended but allowing all authenticated users for now)
router.post('/image', auth, upload.single('image'), uploadImage);

module.exports = router;
