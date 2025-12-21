const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Ensure upload directories exist
const uploadDirs = {
  pdf: './uploads/pdf',
  audio: './uploads/audio',
  images: './uploads/images',
};

Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.info(`Created upload directory: ${dir}`);
  }
});

// Configure storage for PDFs
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirs.pdf);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `pdf-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Configure storage for audio files
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirs.audio);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `audio-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter for PDFs
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// File filter for audio files
const audioFilter = (req, file, cb) => {
  const allowedMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 'audio/ogg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files (MP3, WAV, WebM, OGG) are allowed'), false);
  }
};

// Create upload middleware instances
const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB default
  },
});

const uploadAudio = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 52428800, // 50MB for audio files
  },
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

module.exports = {
  uploadPDF,
  uploadAudio,
  handleUploadError,
};


