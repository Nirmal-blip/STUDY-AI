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
    const pythonServiceUrl = config.pythonAiServiceUrl || "https://study-ai-1-nigc.onrender.com";
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    logger.info(`Requesting transcription for YouTube video: ${videoId}`);
    logger.info(`Using Python service: ${pythonServiceUrl}`);
    
    // Call FastAPI /transcribe-youtube endpoint
    const response = await axios.post(
      `${pythonServiceUrl}/transcribe-youtube`,
      {
        youtube_url: youtubeUrl
      },
      {
        timeout: 600000, // 10 minutes timeout
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    
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
    logger.error(`❌ Whisper transcript failed for ${videoId}:`, err.message);
    
    // Handle specific error cases
    if (err.response) {
      // API returned an error response
      const status = err.response.status;
      const detail = err.response.data?.detail || err.message;
      
      if (status === 400) {
        logger.error(`Bad request: ${detail}`);
      } else if (status === 503) {
        logger.error(`Service unavailable: ${detail}`);
      } else {
        logger.error(`API error (${status}): ${detail}`);
      }
    } else if (err.code === "ECONNREFUSED") {
      logger.error(`Connection refused. Is the Python service running at ${config.pythonAiServiceUrl}?`);
    } else if (err.code === "ETIMEDOUT") {
      logger.error("Request timed out. Video may be too long or service is overloaded.");
    }
    
    return { 
      transcript: null, 
      metadata: {},
      error: err.message 
    };
  }
};


