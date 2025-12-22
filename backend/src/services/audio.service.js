const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config/env');

/**
 * Generate text-to-speech audio
 * @param {string} text - Text to convert to speech
 * @param {string} voice - Voice type (teacher/student)
 * @returns {Promise<string>} - URL to audio file
 */
const generateTTS = async (text, voice = 'teacher') => {
  try {
    // This would typically call a TTS service like OpenAI TTS, Google TTS, or Azure TTS
    // For now, we'll return a placeholder
    
    // If Python AI service is configured, use it
    if (config.pythonAiServiceUrl) {
      try {
        const response = await axios.post(`${config.pythonAiServiceUrl}/api/tts`, {
          text,
          voice,
        });
        return response.data.audioUrl;
      } catch (error) {
        logger.warn('Python TTS service not available, using fallback');
      }
    }

    // Fallback: Return null (frontend can use browser TTS)
    logger.info('TTS generation requested but service not configured');
    return null;
  } catch (error) {
    logger.error('TTS generation error:', error);
    return null;
  }
};

/**
 * Generate dialogue audio (teacher-student conversation)
 * @param {string} question - Student question
 * @param {string} answer - Teacher answer
 * @returns {Promise<{questionAudio: string, answerAudio: string}>}
 */
const generateDialogueAudio = async (question, answer) => {
  try {
    const questionAudio = await generateTTS(question, 'student');
    const answerAudio = await generateTTS(answer, 'teacher');

    return {
      questionAudio,
      answerAudio,
    };
  } catch (error) {
    logger.error('Dialogue audio generation error:', error);
    return {
      questionAudio: null,
      answerAudio: null,
    };
  }
};

module.exports = {
  generateTTS,
  generateDialogueAudio,
};


