const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudySession',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
  },
  context: {
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    }],
    videos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
    }],
  },
  metadata: {
    tokensUsed: Number,
    model: String,
    responseTime: Number,
  },
}, {
  timestamps: true,
});

// Index for session messages
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);




