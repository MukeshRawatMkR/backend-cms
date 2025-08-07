const { body } = require('express-validator');

const updateMediaValidation = [
  body('alt')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Alt text cannot exceed 200 characters'),
  
  body('caption')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Caption cannot exceed 500 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a comma-separated string'),
  
  body('folder')
    .optional()
    .isString()
    .trim()
    .withMessage('Folder must be a string'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value')
];

module.exports = {
  updateMediaValidation
};