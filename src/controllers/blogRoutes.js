const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth'); // Middleware to protect routes
const {
  createBlog,
  getMyBlogs,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private
router.post('/', protect, createBlog);

// @route   GET /api/blogs/my
// @desc    Get blogs created by the logged-in user
// @access  Private
router.get('/my', protect, getMyBlogs);

// @route   GET /api/blogs
// @desc    Get all blogs (public or based on your logic)
// @access  Public
router.get('/', getAllBlogs);

// @route   GET /api/blogs/:id
// @desc    Get a single blog by ID
// @access  Public
router.get('/:id', getSingleBlog);

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private (only owner)
router.put('/:id', protect, updateBlog);

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private (only owner)
router.delete('/:id', protect, deleteBlog);

module.exports = router;
