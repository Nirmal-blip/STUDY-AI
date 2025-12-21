const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const studyRoutes = require('./routes/study.routes');
const chatRoutes = require('./routes/chat.routes');
const chatHistoryRoutes = require('./routes/chat-history.routes');
const videoRoutes = require('./routes/video.routes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - CORS Configuration
const allowedOrigins = [
  // Local development origins
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  // Add production frontend URLs from environment
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  // Allow multiple frontend URLs from environment (comma-separated)
  ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',').map(url => url.trim()) : [])
];

// Remove duplicates
const uniqueOrigins = [...new Set(allowedOrigins)];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (uniqueOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log blocked origins for debugging
      logger.warn(`CORS blocked origin: ${origin}. Allowed origins: ${uniqueOrigins.join(', ')}`);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat-history', chatHistoryRoutes);
app.use('/api/video', videoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;

