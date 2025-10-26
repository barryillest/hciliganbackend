const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

// All project routes require authentication
router.use(authMiddleware);

// Project routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProject);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Project items routes
router.post('/:id/items', projectController.addProjectItem);
router.put('/:id/items/:itemId', projectController.updateProjectItem);
router.delete('/:id/items/:itemId', projectController.deleteProjectItem);

module.exports = router;
