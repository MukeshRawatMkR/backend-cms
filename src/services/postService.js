const Post = require('../models/Post');
const AppError = require('../utils/AppError');
const { getPaginationOptions, getPaginatedResult } = require('../utils/pagination');

const getAllPosts = async (queryParams) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  
  // Build filter
  const filter = {};
  if (queryParams.status) {
    filter.status = queryParams.status;
  }
  if (queryParams.author) {
    filter.author = queryParams.author;
  }
  if (queryParams.category) {
    filter.categories = queryParams.category;
  }
  if (queryParams.search) {
    filter.$text = { $search: queryParams.search };
  }
  if (queryParams.isFeatured !== undefined) {
    filter.isFeatured = queryParams.isFeatured === 'true';
  }

  // Build sort
  let sort = { createdAt: -1 };
  if (queryParams.sortBy) {
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    sort = { [queryParams.sortBy]: sortOrder };
  }

  const posts = await Post.find(filter)
    .populate('author', 'username firstName lastName avatar')
    .populate('categories', 'name slug color')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments(filter);

  return getPaginatedResult(posts, total, page, limit);
};

const getPostById = async (postId) => {
  const post = await Post.findById(postId)
    .populate('author', 'username firstName lastName avatar bio')
    .populate('categories', 'name slug color')
    .populate('likes', 'username firstName lastName');

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  return post;
};

const getPostBySlug = async (slug) => {
  const post = await Post.findOne({ slug })
    .populate('author', 'username firstName lastName avatar bio')
    .populate('categories', 'name slug color')
    .populate('likes', 'username firstName lastName');

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  return post;
};

const createPost = async (postData) => {
  const post = await Post.create(postData);
  await post.populate('author', 'username firstName lastName avatar');
  await post.populate('categories', 'name slug color');
  
  return post;
};

const updatePost = async (postId, updateData, currentUser) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check permissions
  if (post.author.toString() !== currentUser.id && 
      !['admin', 'editor'].includes(currentUser.role)) {
    throw new AppError('You can only update your own posts', 403);
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    updateData,
    { new: true, runValidators: true }
  )
    .populate('author', 'username firstName lastName avatar')
    .populate('categories', 'name slug color');

  return updatedPost;
};

const deletePost = async (postId, currentUser) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check permissions
  if (post.author.toString() !== currentUser.id && 
      currentUser.role !== 'admin') {
    throw new AppError('You can only delete your own posts', 403);
  }

  await Post.findByIdAndDelete(postId);
};

const likePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.likes.includes(userId)) {
    throw new AppError('Post already liked', 400);
  }

  post.likes.push(userId);
  await post.save();

  await post.populate('likes', 'username firstName lastName');
  return post;
};

const unlikePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (!post.likes.includes(userId)) {
    throw new AppError('Post not liked yet', 400);
  }

  post.likes = post.likes.filter(id => id.toString() !== userId);
  await post.save();

  await post.populate('likes', 'username firstName lastName');
  return post;
};

const getPublishedPosts = async (queryParams) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  
  const filter = { status: 'published' };
  
  if (queryParams.category) {
    filter.categories = queryParams.category;
  }
  if (queryParams.search) {
    filter.$text = { $search: queryParams.search };
  }

  let sort = { publishedAt: -1 };
  if (queryParams.sortBy) {
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    sort = { [queryParams.sortBy]: sortOrder };
  }

  const posts = await Post.find(filter)
    .populate('author', 'username firstName lastName avatar')
    .populate('categories', 'name slug color')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments(filter);

  return getPaginatedResult(posts, total, page, limit);
};

const getFeaturedPosts = async () => {
  const posts = await Post.find({ 
    status: 'published', 
    isFeatured: true 
  })
    .populate('author', 'username firstName lastName avatar')
    .populate('categories', 'name slug color')
    .sort({ publishedAt: -1 })
    .limit(5);

  return posts;
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getPublishedPosts,
  getFeaturedPosts
};