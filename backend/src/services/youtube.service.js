const axios = require("axios");
const config = require("../config/env");
const logger = require("../utils/logger");

/**
 * Get transcript from YouTube video using FastAPI Whisper service.
 * 
 * This function sends a YouTube URL to the Python FastAPI service,
 * which handles:
 * - YouTube audio download (yt-dlp)
 * - Audio extraction/conversion
 * - Whisper transcription
 * 
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<{transcript: string, metadata: object}>}
 */
exports.getTranscript = async (videoId) => {
  try {
    // Use config value directly - don't override with fallback
    const pythonServiceUrl = config.pythonAiServiceUrl;
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    logger.info(`🎬 Requesting transcription for YouTube video: ${videoId}`);
    logger.info(`🌐 Using Python service URL: ${pythonServiceUrl}`);
    logger.info(`📹 YouTube URL: ${youtubeUrl}`);
    logger.info(`🔍 Full endpoint: ${pythonServiceUrl}/transcribe-youtube`);
    
    // Validate URL before making request
    if (!pythonServiceUrl || pythonServiceUrl === 'undefined') {
      throw new Error(`Python service URL is not configured. Current value: ${pythonServiceUrl}`);
    }
    
    // Call FastAPI /transcribe-youtube endpoint
    logger.info(`📤 Sending POST request to: ${pythonServiceUrl}/transcribe-youtube`);
    const response = await axios.post(
      `${pythonServiceUrl}/transcribe-youtube`,
      {
        youtube_url: youtubeUrl
      },
      {
        timeout: 600000, // 10 minutes timeout
        headers: {
          "Content-Type": "application/json"
        },
        validateStatus: function (status) {
          return status < 500; // Don't throw for 4xx errors, we'll handle them
        }
      }
    );
    
    logger.info(`📥 Response status: ${response.status}`);
    logger.info(`📥 Response data keys: ${Object.keys(response.data || {}).join(', ')}`);
    
    const { transcript, duration, language, metadata } = response.data;
    
    if (!transcript || transcript.trim().length < 100) {
      throw new Error("Transcript too short or empty");
    }
    
    logger.info(`✅ Transcription completed for ${videoId}. Length: ${transcript.length} chars`);
    
    return {
      transcript: transcript.trim(),
      metadata: {
        duration: duration || null,
        language: language || null,
        thumbnail: metadata?.thumbnail || null,
        channelName: metadata?.channel || null,
        title: metadata?.title || null,
        ...metadata
      }
    };
  } catch (err) {
    logger.error(`❌ Whisper transcript failed for ${videoId}`);
    logger.error(`❌ Error message: ${err.message}`);
    logger.error(`❌ Error code: ${err.code || 'N/A'}`);
    logger.error(`❌ Error stack: ${err.stack}`);
    logger.error(`❌ Attempted URL: ${config.pythonAiServiceUrl}/transcribe-youtube`);
    
    // Handle specific error cases
    if (err.response) {
      // API returned an error response
      const status = err.response.status;
      const detail = err.response.data?.detail || err.response.data?.message || err.message;
      
      logger.error(`📥 API Response Status: ${status}`);
      logger.error(`📥 API Response Data:`, JSON.stringify(err.response.data, null, 2));
      
      if (status === 400) {
        logger.error(`❌ Bad request: ${detail}`);
      } else if (status === 503) {
        logger.error(`❌ Service unavailable: ${detail}`);
      } else if (status === 404) {
        logger.error(`❌ Endpoint not found. Check if ${config.pythonAiServiceUrl}/transcribe-youtube exists`);
      } else {
        logger.error(`❌ API error (${status}): ${detail}`);
      }
    } else if (err.code === "ECONNREFUSED") {
      logger.error(`❌ Connection refused. Is the Python service running at ${config.pythonAiServiceUrl}?`);
      logger.error(`❌ Check: curl ${config.pythonAiServiceUrl}/health`);
    } else if (err.code === "ETIMEDOUT" || err.code === "ECONNABORTED") {
      logger.error(`❌ Request timed out. Video may be too long or service is overloaded.`);
    } else if (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN") {
      logger.error(`❌ DNS resolution failed. Check if ${config.pythonAiServiceUrl} is a valid URL`);
    } else if (err.message && err.message.includes('Network Error')) {
      logger.error(`❌ Network error. Check CORS and service availability`);
    }
    
    return { 
      transcript: null, 
      metadata: {},
      error: err.message 
    };
  }
};


