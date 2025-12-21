const User = require('../models/User.model');
const { generateToken } = require('../utils/helpers');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

/* ===================== COOKIE OPTIONS ===================== */
const cookieOptions = {
  httpOnly: true,
  secure: true,        // 🔥 REQUIRED on Render (HTTPS)
  sameSite: 'none',    // 🔥 REQUIRED for cross-origin (localhost / Vercel)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/* ===================== REGISTER ===================== */
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password, role, userType, fullname } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // 🔹 map frontend userType → backend role
    let userRole = role || 'student';
    if (userType === 'doctor' || userType === 'educator') {
      userRole = 'teacher';
    } else if (userType === 'patient' || userType === 'student') {
      userRole = 'student';
    }

    const user = await User.create({
      name: fullname || name,
      email,
      password,
      role: userRole,
    });

    const token = generateToken(user._id);

    // 🔥 SET COOKIE (FIXED)
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        userId: user._id.toString(),
        email: user.email,
        fullname: user.name,
        userType: user.role === 'student' ? 'student' : 'educator',
      },
    });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

/* ===================== LOGIN ===================== */
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    // 🔥 SET COOKIE (FIXED)
    res.cookie('token', token, cookieOptions);

    res.json({
      success: true,
      user: {
        userId: user._id.toString(),
        email: user.email,
        fullname: user.name,
        userType: user.role === 'student' ? 'student' : 'educator',
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

/* ===================== GET ME ===================== */
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        userId: user._id.toString(),
        email: user.email,
        fullname: user.name,
        userType: user.role === 'student' ? 'student' : 'educator',
      },
    });
  } catch (error) {
    logger.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/* ===================== UPDATE PROFILE ===================== */
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      dateOfBirth,
      college,
      course,
      year,
      bio,
      avatar,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: fullName,
        phone,
        dateOfBirth,
        college,
        course,
        year,
        bio,
        avatar,
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/* ===================== LOGOUT ===================== */
// @route GET /api/auth/logout
const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
};
