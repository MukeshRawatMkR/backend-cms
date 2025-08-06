

const express = require('express');
const userRoutes = require('./userRoutes');
const postRoutes = require('./blogRoutes');
const commentRoutes = require('./comment');
const auth = require('./authRoutes');
const router = express.Router();

// Authentication routes
router.use('/api/auth', auth);

//Profile routes
router.use('/api/user', userRoutes);
// router.use('/api/profile', userRoutes);


// Blog routes
//todo -> Create a new blog (only logged-in users)              
router.use('/api/blogs', postRoutes);



// router.use('/users', userRoutes);
router.use('/api/comments', commentRoutes);

module.exports = router;


