const express = require('express');
const router = express.Router();
const {
  createChatSession,
} = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth.middleware');

// Routes
router.post('/session', protect, createChatSession);

module.exports = router;




