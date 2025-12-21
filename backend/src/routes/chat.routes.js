const express = require('express');
const router = express.Router();

const {
  createChatSession,
  sendMessage,
  getMessages,
  generateAudioDialogue,
  getAudioDialogues,
} = require('../controllers/chat.controller');

const { protect } = require('../middlewares/auth.middleware');

// ✅ ADD THIS
router.post('/session', protect, createChatSession);

// existing routes
router.post('/messages', protect, sendMessage);
// router.get('/messages/:sessionId', protect, getMessages);

router.post('/audio-dialogue', protect, generateAudioDialogue);
router.get('/audio-dialogue/:sessionId', protect, getAudioDialogues);

module.exports = router;
