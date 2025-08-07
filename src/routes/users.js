const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const {
  createUserValidation,
  updateUserValidation,
  updateRoleValidation
} = require('../validations/userValidation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Admin and Editor routes
router.get('/', requireRole(['admin', 'editor']), userController.getAllUsers);
router.post('/', requireRole(['admin']), createUserValidation, userController.createUser);

// Routes accessible by all authenticated users (for viewing specific users)
router.get('/:id', userController.getUserById);

// Admin only routes
router.put('/:id', requireRole(['admin']), updateUserValidation, userController.updateUser);
router.delete('/:id', requireRole(['admin']), userController.deleteUser);
router.put('/:id/role', requireRole(['admin']), updateRoleValidation, userController.updateUserRole);
router.put('/:id/status', requireRole(['admin']), userController.toggleUserStatus);

module.exports = router;