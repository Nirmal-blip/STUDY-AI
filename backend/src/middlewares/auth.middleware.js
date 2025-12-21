const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  try {
    let token = null;

    // 🔹 Priority 1: Cookie (frontend)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // 🔹 Priority 2: Authorization header (Postman / API)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

/* ===================== ROLE BASED ===================== */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' not authorized`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
