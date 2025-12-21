const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  logout,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// Validation rules
const registerValidation = [
  body('name').optional({ nullable: true, checkFalsy: true }).trim(),
  body('fullname').optional({ nullable: true, checkFalsy: true }).trim(),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body().custom((value) => {
    // Either 'name' or 'fullname' must be provided
    if (!value.name && !value.fullname) {
      throw new Error('Name or fullname is required');
    }
    return true;
  }),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

module.exports = router;

