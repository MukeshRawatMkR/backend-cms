const User = require('../models/User');
const AppError = require('../utils/AppError');
const { getPaginationOptions, getPaginatedResult } = require('../utils/pagination');

const getAllUsers = async (queryParams) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  
  // Build filter
  const filter = {};
  if (queryParams.role) {
    filter.role = queryParams.role;
  }
  if (queryParams.isActive !== undefined) {
    filter.isActive = queryParams.isActive === 'true';
  }
  if (queryParams.search) {
    filter.$or = [
      { username: { $regex: queryParams.search, $options: 'i' } },
      { email: { $regex: queryParams.search, $options: 'i' } },
      { firstName: { $regex: queryParams.search, $options: 'i' } },
      { lastName: { $regex: queryParams.search, $options: 'i' } }
    ];
  }

  // Build sort
  let sort = { createdAt: -1 };
  if (queryParams.sortBy) {
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    sort = { [queryParams.sortBy]: sortOrder };
  }

  const users = await User.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  return getPaginatedResult(users, total, page, limit);
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

const createUser = async (userData) => {
  const { email, username } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new AppError('User already exists with this email or username', 400);
  }

  const user = await User.create(userData);
  return user;
};

const updateUser = async (userId, updateData, currentUser) => {
  // Remove sensitive fields that shouldn't be updated directly
  const { password, refreshToken, ...allowedUpdates } = updateData;

  // Only admins can change roles
  if (allowedUpdates.role && currentUser.role !== 'admin') {
    throw new AppError('Only admins can change user roles', 403);
  }

  // Users can't change their own role (except admins)
  if (allowedUpdates.role && userId === currentUser.id && currentUser.role !== 'admin') {
    throw new AppError('You cannot change your own role', 403);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    allowedUpdates,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const deleteUser = async (userId, currentUser) => {
  // Users can't delete themselves
  if (userId === currentUser.id) {
    throw new AppError('You cannot delete your own account', 403);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Only admins can delete other admins
  if (user.role === 'admin' && currentUser.role !== 'admin') {
    throw new AppError('Only admins can delete admin accounts', 403);
  }

  await User.findByIdAndDelete(userId);
};

const updateUserRole = async (userId, newRole, currentUser) => {
  // Only admins can change roles
  if (currentUser.role !== 'admin') {
    throw new AppError('Only admins can change user roles', 403);
  }

  // Users can't change their own role
  if (userId === currentUser.id) {
    throw new AppError('You cannot change your own role', 403);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const toggleUserStatus = async (userId, currentUser) => {
  // Users can't deactivate themselves
  if (userId === currentUser.id) {
    throw new AppError('You cannot change your own status', 403);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isActive = !user.isActive;
  await user.save();

  return user;
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