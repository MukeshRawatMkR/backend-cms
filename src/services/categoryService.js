const Category = require('../models/Category');
const Post = require('../models/Post');
const AppError = require('../utils/AppError');
const { getPaginationOptions, getPaginatedResult } = require('../utils/pagination');

const getAllCategories = async (queryParams) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  
  // Build filter
  const filter = {};
  if (queryParams.parentCategory) {
    filter.parentCategory = queryParams.parentCategory;
  }
  if (queryParams.isActive !== undefined) {
    filter.isActive = queryParams.isActive === 'true';
  }
  if (queryParams.search) {
    filter.$or = [
      { name: { $regex: queryParams.search, $options: 'i' } },
      { description: { $regex: queryParams.search, $options: 'i' } }
    ];
  }

  // Build sort
  let sort = { sortOrder: 1, name: 1 };
  if (queryParams.sortBy) {
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    sort = { [queryParams.sortBy]: sortOrder };
  }

  const categories = await Category.find(filter)
    .populate('createdBy', 'username firstName lastName')
    .populate('parentCategory', 'name slug')
    .populate('postCount')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments(filter);

  return getPaginatedResult(categories, total, page, limit);
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId)
    .populate('createdBy', 'username firstName lastName')
    .populate('parentCategory', 'name slug')
    .populate('subcategories', 'name slug color')
    .populate('postCount');

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return category;
};

const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug })
    .populate('createdBy', 'username firstName lastName')
    .populate('parentCategory', 'name slug')
    .populate('subcategories', 'name slug color')
    .populate('postCount');

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return category;
};

const createCategory = async (categoryData) => {
  // Check if parent category exists and is valid
  if (categoryData.parentCategory) {
    const parentCategory = await Category.findById(categoryData.parentCategory);
    if (!parentCategory) {
      throw new AppError('Parent category not found', 404);
    }
  }

  const category = await Category.create(categoryData);
  await category.populate('createdBy', 'username firstName lastName');
  await category.populate('parentCategory', 'name slug');
  
  return category;
};

const updateCategory = async (categoryId, updateData, currentUser) => {
  const category = await Category.findById(categoryId);
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Check permissions
  if (category.createdBy.toString() !== currentUser.id && 
      !['admin', 'editor'].includes(currentUser.role)) {
    throw new AppError('You can only update categories you created', 403);
  }

  // Validate parent category if provided
  if (updateData.parentCategory) {
    if (updateData.parentCategory === categoryId) {
      throw new AppError('Category cannot be its own parent', 400);
    }
    
    const parentCategory = await Category.findById(updateData.parentCategory);
    if (!parentCategory) {
      throw new AppError('Parent category not found', 404);
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    updateData,
    { new: true, runValidators: true }
  )
    .populate('createdBy', 'username firstName lastName')
    .populate('parentCategory', 'name slug');

  return updatedCategory;
};

const deleteCategory = async (categoryId, currentUser) => {
  const category = await Category.findById(categoryId);
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Check permissions
  if (category.createdBy.toString() !== currentUser.id && 
      currentUser.role !== 'admin') {
    throw new AppError('You can only delete categories you created', 403);
  }

  // Check if category has posts
  const postCount = await Post.countDocuments({ categories: categoryId });
  if (postCount > 0) {
    throw new AppError('Cannot delete category that has posts', 400);
  }

  // Check if category has subcategories
  const subcategoryCount = await Category.countDocuments({ parentCategory: categoryId });
  if (subcategoryCount > 0) {
    throw new AppError('Cannot delete category that has subcategories', 400);
  }

  await Category.findByIdAndDelete(categoryId);
};

const getCategoryPosts = async (categoryId, queryParams) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  const { page, limit, skip } = getPaginationOptions(queryParams);
  
  const filter = { categories: categoryId };
  if (queryParams.status) {
    filter.status = queryParams.status;
  } else {
    filter.status = 'published'; // Default to published posts
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

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryPosts
};