const express = require('express');
const postController = require('../controllers/postController');
const { authenticateToken, requireRole, optionalAuth } = require('../middlewares/auth');
const {
  createPostValidation,
  updatePostValidation
} = require('../validations/postValidation');

const router = express.Router();

// Public routes
router.get('/published', postController.getPublishedPosts);
router.get('/featured', postController.getFeaturedPosts);
router.get('/slug/:slug', optionalAuth, postController.getPostBySlug);

// Protected routes
router.use(authenticateToken);

// Routes accessible by authenticated users
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Routes for creating and managing posts (Editor and Admin)
router.post('/', requireRole(['admin', 'editor']), createPostValidation, postController.createPost);
router.put('/:id', requireRole(['admin', 'editor']), updatePostValidation, postController.updatePost);

// Admin only routes
router.delete('/:id', requireRole(['admin']), postController.deletePost);

// Like/Unlike routes (all authenticated users)
router.post('/:id/like', postController.likePost);
router.delete('/:id/like', postController.unlikePost);

module.exports = router;