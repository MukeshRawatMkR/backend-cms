// src/routes/blogRoutes.js
const express = require('express');
const router = express.Router();

const {
  createBlog
  // getMyBlogs,
  // getAllBlogs,
  // getSingleBlog,
  // updateBlog,
  // deleteBlog,
} = require('../controllers/blogController');

const protect = require('../middlewares/auth');

// 👇 Public routes
// router.get('/', getAllBlogs);                 // GET /post            - Fetch all blogs
// router.get('/:id', getSingleBlog);            // GET /post/:id        - Fetch a single blog by ID

// 👇 Protected routes
router.post('/', protect, createBlog);        // POST /post           - Create a new blog
// router.get('/my/blogs', protect, getMyBlogs); // GET /post/my/blogs   - Get blogs of logged-in user
// router.put('/:id', protect, updateBlog);      // PUT /post/:id        - Update a blog by ID
// router.delete('/:id', protect, deleteBlog);   // DELETE /post/:id     - Delete a blog by ID

module.exports = router;
