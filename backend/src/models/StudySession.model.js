const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Session title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  }],
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
  chatMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage',
  }],
  audioDialogues: [{
    question: String,
    answer: String,
    audioUrl: String,
    timestamp: Date,
  }],
  summary: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for user sessions
studySessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('StudySession', studySessionSchema);


