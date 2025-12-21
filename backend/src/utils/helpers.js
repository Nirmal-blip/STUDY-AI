/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - YouTube video ID or null
 */
const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Clean the URL
  const cleanUrl = url.trim();

  // YouTube URL patterns (order matters - most specific first)
  const patterns = [
    // Short URL: youtu.be/VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // Standard watch URL: youtube.com/watch?v=VIDEO_ID
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    // Embed URL: youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    // Mobile URL: m.youtube.com/watch?v=VIDEO_ID
    /m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    // URL with other params: youtube.com/watch?feature=...&v=VIDEO_ID
    /youtube\.com\/watch\?.*[&?]v=([a-zA-Z0-9_-]{11})/,
    // Shorts URL: youtube.com/shorts/VIDEO_ID
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If no pattern matches, check if it's already just a video ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
};

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Calculate word count from text
 * @param {string} text - Text content
 * @returns {number} - Word count
 */
const getWordCount = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
const truncateText = (text, maxLength = 200) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Sanitize filename
 * @param {string} filename - Original filename
 * @returns {string} - Sanitized filename
 */
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
};

/**
 * Format duration in seconds to readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration (e.g., "1h 23m 45s")
 */
const formatDuration = (seconds) => {
  if (!seconds) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(' ') || '0s';
};

module.exports = {
  extractYouTubeId,
  generateToken,
  getWordCount,
  truncateText,
  sanitizeFilename,
  formatDuration,
};


