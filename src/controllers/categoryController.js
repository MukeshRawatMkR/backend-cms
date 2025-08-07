const categoryService = require('../services/categoryService');
const { validationResult } = require('express-validator');
const createResponse = require('../utils/responseFormatter');

const getAllCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getAllCategories(req.query);
    res.json(createResponse(true, 'Categories retrieved successfully', result));
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(createResponse(true, 'Category retrieved successfully', category));
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    res.json(createResponse(true, 'Category retrieved successfully', category));
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const categoryData = {
      ...req.body,
      createdBy: req.user.id
    };

    const category = await categoryService.createCategory(categoryData);
    res.status(201).json(createResponse(true, 'Category created successfully', category));
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const category = await categoryService.updateCategory(req.params.id, req.body, req.user);
    res.json(createResponse(true, 'Category updated successfully', category));
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id, req.user);
    res.json(createResponse(true, 'Category deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const getCategoryPosts = async (req, res, next) => {
  try {
    const result = await categoryService.getCategoryPosts(req.params.id, req.query);
    res.json(createResponse(true, 'Category posts retrieved successfully', result));
  } catch (error) {
    next(error);
  }
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