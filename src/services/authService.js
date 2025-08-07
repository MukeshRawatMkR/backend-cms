const User = require('../models/User');
const { generateToken, generateRefreshToken, verifyToken } = require('../config/jwt');
const AppError = require('../utils/AppError');

const register = async (userData) => {
  const { email, username } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new AppError('User already exists with this email or username', 400);
  }

  // Create new user
  const user = await User.create(userData);

  // Generate tokens
  const token = generateToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  return {
    user: userResponse,
    token,
    refreshToken
  };
};

const login = async ({ email, password }) => {
  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update last login
  await user.updateLastLogin();

  // Generate tokens
  const token = generateToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  return {
    user: userResponse,
    token,
    refreshToken
  };
};

const refreshToken = async (refreshTokenString) => {
  if (!refreshTokenString) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    const decoded = verifyToken(refreshTokenString);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshTokenString) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const token = generateToken({ id: user._id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      token,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

const updateProfile = async (userId, updateData) => {
  // Remove sensitive fields
  const { password, role, refreshToken, ...allowedUpdates } = updateData;

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

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Clear refresh token to force re-login
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });
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