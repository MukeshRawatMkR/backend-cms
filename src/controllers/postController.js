exports.searchPosts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const search = q
      ? {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } }
          ]
        }
      : {};
    const posts = await Post.find(search).populate('author', 'name email');
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};