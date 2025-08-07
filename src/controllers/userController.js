const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const createResponse = require('../utils/responseFormatter');

const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.json(createResponse(true, 'Users retrieved successfully', result));
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(createResponse(true, 'User retrieved successfully', user));
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const user = await userService.createUser(req.body);
    res.status(201).json(createResponse(true, 'User created successfully', user));
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const user = await userService.updateUser(req.params.id, req.body);
    res.json(createResponse(true, 'User updated successfully', user));
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json(createResponse(true, 'User deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const user = await userService.updateUserRole(req.params.id, req.body.role);
    res.json(createResponse(true, 'User role updated successfully', user));
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleUserStatus(req.params.id);
    res.json(createResponse(true, 'User status updated successfully', user));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  toggleUserStatus
};