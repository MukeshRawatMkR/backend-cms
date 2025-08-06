const Comment = require('../models/Comment');

exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const comments = await Comment.find({ post: postId })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email');
    const total = await Comment.countDocuments({ post: postId });
    res.json({ comments, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }

};

exports.updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};