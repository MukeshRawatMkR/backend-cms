// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
// console.log('AuthController loaded');

// Define Joi schema for validation
const signupSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).trim().required(),
  lastName: Joi.string().min(1).max(50).trim().required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
    })
});
const signup = async (req, res) => {
  try {
    // ✅ Validate input
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { firstName, lastName, email, password } = value;

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // ✅ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // ✅ Create and save user
    const user = new User({ firstName, lastName, email, password: hashed });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Login API
 const login = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await user.validatePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = await user.getJWTToken();
    // console.log("I'm here ", token);
    res.cookie("token", token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }); // 1 day
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Logout API
const logout = (req, res) => {
  try {
    res.clearCookie('token', null, { expires: new Date(Date.now()) }); // Clear cookie
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

module.exports = {
  signup,
  login,
  logout
};