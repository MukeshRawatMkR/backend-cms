//only with valid JWT token can access protected routes.
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if Authorization header exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 2. Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Fetch user from DB and attach to req
      req.user = await User.findById(decoded._id).select('-password');
// console.log(req.user);
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = protect;
