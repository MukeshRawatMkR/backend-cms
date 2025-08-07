const postService = require('../services/postService');
const { validationResult } = require('express-validator');
const createResponse = require('../utils/responseFormatter');

const getAllPosts = async (req, res, next) => {
  try {
    const result = await postService.getAllPosts(req.query);
    res.json(createResponse(true, 'Posts retrieved successfully', result));
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.json(createResponse(true, 'Post retrieved successfully', post));
  } catch (error) {
    next(error);
  }
};

const getPostBySlug = async (req, res, next) => {
  try {
    const post = await postService.getPostBySlug(req.params.slug);
    
    // Increment views for published posts
    if (post.status === 'published') {
      await post.incrementViews();
    }
    
    res.json(createResponse(true, 'Post retrieved successfully', post));
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const postData = {
      ...req.body,
      author: req.user.id
    };

    const post = await postService.createPost(postData);
    res.status(201).json(createResponse(true, 'Post created successfully', post));
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const post = await postService.updatePost(req.params.id, req.body, req.user);
    res.json(createResponse(true, 'Post updated successfully', post));
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user);
    res.json(createResponse(true, 'Post deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  try {
    const post = await postService.likePost(req.params.id, req.user.id);
    res.json(createResponse(true, 'Post liked successfully', post));
  } catch (error) {
    next(error);
  }
};

const unlikePost = async (req, res, next) => {
  try {
    const post = await postService.unlikePost(req.params.id, req.user.id);
    res.json(createResponse(true, 'Post unliked successfully', post));
  } catch (error) {
    next(error);
  }
};

const getPublishedPosts = async (req, res, next) => {
  try {
    const result = await postService.getPublishedPosts(req.query);
    res.json(createResponse(true, 'Published posts retrieved successfully', result));
  } catch (error) {
    next(error);
  }
};

const getFeaturedPosts = async (req, res, next) => {
  try {
    const posts = await postService.getFeaturedPosts();
    res.json(createResponse(true, 'Featured posts retrieved successfully', posts));
  } catch (error) {
    next(error);
  }
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