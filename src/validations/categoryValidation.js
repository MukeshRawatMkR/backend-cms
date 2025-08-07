const { body } = require('express-validator');

const createCategoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name is required and cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color (e.g., #FF0000 or #F00)'),
  
  body('icon')
    .optional()
    .isString()
    .trim()
    .withMessage('Icon must be a string'),
  
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Parent category must be a valid category ID'),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color (e.g., #FF0000 or #F00)'),
  
  body('icon')
    .optional()
    .isString()
    .trim()
    .withMessage('Icon must be a string'),
  
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Parent category must be a valid category ID'),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation
};