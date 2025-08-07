const express = require('express');
const pageController = require('../controllers/pageController');
const { authenticateToken, requireRole, optionalAuth } = require('../middlewares/auth');
const {
  createPageValidation,
  updatePageValidation
} = require('../validations/pageValidation');

const router = express.Router();

// Public routes
router.get('/published', pageController.getPublishedPages);
router.get('/menu', pageController.getMenuPages);
router.get('/home', pageController.getHomePage);
router.get('/slug/:slug', optionalAuth, pageController.getPageBySlug);

// Protected routes
router.use(authenticateToken);

// Routes accessible by authenticated users
router.get('/', pageController.getAllPages);
router.get('/:id', pageController.getPageById);

// Routes for creating and managing pages (Editor and Admin)
router.post('/', requireRole(['admin', 'editor']), createPageValidation, pageController.createPage);
router.put('/:id', requireRole(['admin', 'editor']), updatePageValidation, pageController.updatePage);

// Admin only routes
router.delete('/:id', requireRole(['admin']), pageController.deletePage);

module.exports = router;