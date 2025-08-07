const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const createResponse = require('../utils/responseFormatter');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const result = await authService.register(req.body);
    res.status(201).json(createResponse(true, 'User registered successfully', result));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const result = await authService.login(req.body);
    res.json(createResponse(true, 'Login successful', result));
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json(createResponse(true, 'Token refreshed successfully', result));
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.json(createResponse(true, 'Logout successful'));
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(createResponse(true, 'Profile retrieved successfully', user));
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const user = await authService.updateProfile(req.user.id, req.body);
    res.json(createResponse(true, 'Profile updated successfully', user));
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    await authService.changePassword(req.user.id, req.body);
    res.json(createResponse(true, 'Password changed successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword
};