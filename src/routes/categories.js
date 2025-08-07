const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const {
  createCategoryValidation,
  updateCategoryValidation
} = require('../validations/categoryValidation');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id/posts', categoryController.getCategoryPosts);

// Protected routes
router.use(authenticateToken);

// Routes for creating and managing categories (Editor and Admin)
router.post('/', requireRole(['admin', 'editor']), createCategoryValidation, categoryController.createCategory);
router.put('/:id', requireRole(['admin', 'editor']), updateCategoryValidation, categoryController.updateCategory);

// Admin only routes
router.delete('/:id', requireRole(['admin']), categoryController.deleteCategory);

module.exports = router;