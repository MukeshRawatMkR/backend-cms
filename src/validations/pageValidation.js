const { body } = require('express-validator');

const createPageValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and cannot exceed 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'private'])
    .withMessage('Status must be one of: draft, published, private'),
  
  body('template')
    .optional()
    .isIn(['default', 'landing', 'contact', 'about'])
    .withMessage('Template must be one of: default, landing, contact, about'),
  
  body('parentPage')
    .optional()
    .isMongoId()
    .withMessage('Parent page must be a valid page ID'),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  
  body('showInMenu')
    .optional()
    .isBoolean()
    .withMessage('showInMenu must be a boolean value'),
  
  body('menuOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Menu order must be a non-negative integer'),
  
  body('isHomePage')
    .optional()
    .isBoolean()
    .withMessage('isHomePage must be a boolean value'),
  
  body('featuredImage')
    .optional()
    .isURL()
    .withMessage('Featured image must be a valid URL'),
  
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('SEO title cannot exceed 60 characters'),
  
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description cannot exceed 160 characters'),
  
  body('seoKeywords')
    .optional()
    .isArray()
    .withMessage('SEO keywords must be an array'),
  
  body('seoKeywords.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each SEO keyword must be a string'),
  
  body('customFields')
    .optional()
    .isObject()
    .withMessage('Custom fields must be an object')
];

const updatePageValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content cannot be empty'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'private'])
    .withMessage('Status must be one of: draft, published, private'),
  
  body('template')
    .optional()
    .isIn(['default', 'landing', 'contact', 'about'])
    .withMessage('Template must be one of: default, landing, contact, about'),
  
  body('parentPage')
    .optional()
    .isMongoId()
    .withMessage('Parent page must be a valid page ID'),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  
  body('showInMenu')
    .optional()
    .isBoolean()
    .withMessage('showInMenu must be a boolean value'),
  
  body('menuOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Menu order must be a non-negative integer'),
  
  body('isHomePage')
    .optional()
    .isBoolean()
    .withMessage('isHomePage must be a boolean value'),
  
  body('featuredImage')
    .optional()
    .isURL()
    .withMessage('Featured image must be a valid URL'),
  
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('SEO title cannot exceed 60 characters'),
  
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description cannot exceed 160 characters'),
  
  body('seoKeywords')
    .optional()
    .isArray()
    .withMessage('SEO keywords must be an array'),
  
  body('seoKeywords.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each SEO keyword must be a string'),
  
  body('customFields')
    .optional()
    .isObject()
    .withMessage('Custom fields must be an object')
];

module.exports = {
  createPageValidation,
  updatePageValidation
};