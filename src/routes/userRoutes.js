const express = require('express');
const router = express.Router();
const protect = require("./../middlewares/auth"); // Middleware to protect routes
const { getCurrentUser } = require('../controllers/userController');

router.get('/me', protect, getCurrentUser);

module.exports = router;
