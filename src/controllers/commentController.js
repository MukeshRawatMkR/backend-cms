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