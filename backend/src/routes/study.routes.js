const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  generateSummary,
} = require('../controllers/study.controller');
const { protect } = require('../middlewares/auth.middleware');

// Routes
router.post('/sessions', protect, createSession);
router.get('/sessions', protect, getSessions);
router.get('/sessions/:id', protect, getSessionById);
router.put('/sessions/:id', protect, updateSession);
router.delete('/sessions/:id', protect, deleteSession);
router.post('/sessions/:id/summary', protect, generateSummary);

module.exports = router;




