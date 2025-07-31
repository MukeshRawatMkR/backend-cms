const express = require('express');
const userRoutes = require('./user');
const postRoutes = require('./blogRoutes');
// const commentRoutes = require('./comment');
const auth = require('./authRoutes');

const router = express.Router();
router.use('/', auth);
router.use('/post', postRoutes);
// router.use('/users', userRoutes);
// router.use('/comments', commentRoutes);

module.exports = router;