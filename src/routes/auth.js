const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
} = require('../validations/authValidation');

const router = express.Router();

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);
router.put('/profile', updateProfileValidation, authController.updateProfile);
router.put('/change-password', changePasswordValidation, authController.changePassword);

module.exports = router;