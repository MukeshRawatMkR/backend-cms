const Post = require('../models/Post');
// const protect = require('../middlewares/auth');


const createPost = async (req, res) => {
  console.log(req.user);
  try {
    let { title, content, tags, excerpt } = req.body;

    // 1. Trim input fields
    title = typeof title === 'string' ? title.trim() : '';
    content = typeof content === 'string' ? content.trim() : '';
    tags = Array.isArray(tags)
      ? tags.map(tag => tag.trim()).filter(Boolean)
      : [];

    // 2. Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // 3. Field-specific validations
    if (title.length < 1 || title.length > 50) {
      return res.status(400).json({ message: 'Title must be between 1 and 50 characters' });
    }

    if (content.length < 20 || content.length > 5000) {
      return res.status(400).json({ message: 'Content must be between 20 and 5000 characters' });
    }

    if (tags.length > 5) {
      return res.status(400).json({ message: 'No more than 5 tags allowed' });
    }

    for (let tag of tags) {
      if (typeof tag !== 'string' || tag.length > 30) {
        return res.status(400).json({ message: 'Each tag must be a string under 30 characters' });
      }
    }
    // 4. Create the post
    const post = await Post.create({
  title,
  content,
  excerpt,
  author: req.user._id,
  tags
});
console.log(post);

    await post.save();

    // 5. Response
    return res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    console.error('CreatePost Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = createPost;
