const express = require('express');
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/auth');
const { validateComment } = require('../validations/commentValidation');

const router = express.Router();

// Create comment on a post
router.post('/:postId', auth, validateComment, commentController.createComment);

// Get all comments for a post
router.get('/:postId', commentController.getCommentsByPost);

// Update a comment
router.put('/edit/:id', auth, validateComment, commentController.updateComment);

// Delete a comment
router.delete('/delete/:id', auth, commentController.deleteComment);

module.exports = router;