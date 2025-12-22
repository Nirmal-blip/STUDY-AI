const StudySession = require('../models/StudySession.model');
const Document = require('../models/Document.model');
const Video = require('../models/Video.model');
const llmService = require('../services/llm.service');
const logger = require('../utils/logger');

// @desc    Create study session
// @route   POST /api/study/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { title, description, documentIds, videoIds } = req.body;

    // Validate documents and videos belong to user
    if (documentIds && documentIds.length > 0) {
      const documents = await Document.find({
        _id: { $in: documentIds },
        uploadedBy: req.user._id,
        isActive: true,
      });
      if (documents.length !== documentIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some documents not found or not accessible',
        });
      }
    }

    if (videoIds && videoIds.length > 0) {
      const videos = await Video.find({
        _id: { $in: videoIds },
        uploadedBy: req.user._id,
        isActive: true,
      });
      if (videos.length !== videoIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some videos not found or not accessible',
        });
      }
    }

    const session = await StudySession.create({
      title: title || 'New Study Session',
      description,
      userId: req.user._id,
      documents: documentIds || [],
      videos: videoIds || [],
    });

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    logger.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating study session',
    });
  }
};

// @desc    Get all study sessions
// @route   GET /api/study/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    const sessions = await StudySession.find({
      userId: req.user._id,
      isActive: true,
    })
      .populate('documents', 'title type summary')
      .populate('videos', 'title youtubeUrl summary')
      .populate('chatMessages')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    logger.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching study sessions',
    });
  }
};

// @desc    Get study session by ID
// @route   GET /api/study/sessions/:id
// @access  Private
const getSessionById = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    })
      .populate('documents')
      .populate('videos')
      .populate('chatMessages')
      .populate('userId', 'name email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found',
      });
    }

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    logger.error('Get session by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching study session',
    });
  }
};

// @desc    Update study session
// @route   PUT /api/study/sessions/:id
// @access  Private
const updateSession = async (req, res) => {
  try {
    const { title, description, documentIds, videoIds } = req.body;

    const session = await StudySession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found',
      });
    }

    if (title) session.title = title;
    if (description !== undefined) session.description = description;
    if (documentIds) session.documents = documentIds;
    if (videoIds) session.videos = videoIds;

    await session.save();

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    logger.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating study session',
    });
  }
};

// @desc    Delete study session
// @route   DELETE /api/study/sessions/:id
// @access  Private
const deleteSession = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found',
      });
    }

    session.isActive = false;
    await session.save();

    res.json({
      success: true,
      message: 'Study session deleted successfully',
    });
  } catch (error) {
    logger.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting study session',
    });
  }
};

// @desc    Generate session summary
// @route   POST /api/study/sessions/:id/summary
// @access  Private
const generateSummary = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    })
      .populate('documents', 'content summary')
      .populate('videos', 'transcript summary');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Study session not found',
      });
    }

    // Combine all content
    let combinedContent = '';
    if (session.documents && session.documents.length > 0) {
      combinedContent += session.documents.map(doc => doc.content || doc.summary).join('\n\n');
    }
    if (session.videos && session.videos.length > 0) {
      combinedContent += '\n\n' + session.videos.map(video => video.transcript || video.summary).join('\n\n');
    }

    if (!combinedContent.trim()) {
      return res.status(400).json({
        success: false,
        message: 'No content available to generate summary',
      });
    }

    const summary = await llmService.generateSummary(combinedContent);
    session.summary = summary;
    await session.save();

    res.json({
      success: true,
      summary,
      session,
    });
  } catch (error) {
    logger.error('Generate summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating summary',
    });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  generateSummary,
};


