const User = require('../models/User.model');
const { generateToken } = require('../utils/helpers');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
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

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Map userType to role
    // Frontend can send: 'student'/'educator' OR 'patient'/'doctor'
    // Backend stores as: 'student'/'teacher'
    let userRole = role || 'student';
    if (userType === 'doctor' || userType === 'educator') {
      userRole = 'teacher';
    } else if (userType === 'patient' || userType === 'student') {
      userRole = 'student';
    }

    // Create user
    const user = await User.create({
      name: fullname || name,
      email,
      password,
      role: userRole,
    });

    const token = generateToken(user._id);

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      userId: user._id.toString(),
      email: user.email,
      fullname: user.name,
      userType: user.role === 'student' ? 'student' : 'educator', // Map role to userType (frontend expects 'student'/'educator')
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password, userType } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      token,
      userId: user._id.toString(),
      email: user.email,
      fullname: user.name,
      userType: user.role === 'student' ? 'student' : 'educator', // Map role to userType (frontend expects 'student'/'educator')
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

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
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
          userType: user.role === 'student' ? 'student' : 'educator', // Map role to userType (frontend expects 'student'/'educator')
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

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
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

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // Clear token cookie
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
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

