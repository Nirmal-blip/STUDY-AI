const openai = require('../config/openai');
const logger = require('../utils/logger');

/**
 * Generate embedding vector for text
 * @param {string} text - Text to embed
 * @returns {Promise<Array<number>>}
 */
const generateEmbedding = async (text) => {
  try {
    if (!text || text.trim().length === 0) {
      return [];
    }

    // Truncate if too long
    const maxLength = 8000;
    const truncatedText = text.length > maxLength 
      ? text.substring(0, maxLength) 
      : text;

    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: truncatedText,
    });

    return response.data[0].embedding;
  } catch (error) {
    logger.error('Embedding generation error:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
};

/**
 * Generate embeddings for multiple texts
 * @param {Array<string>} texts - Array of texts to embed
 * @returns {Promise<Array<Array<number>>>}
 */
const generateEmbeddings = async (texts) => {
  try {
    const embeddings = await Promise.all(
      texts.map(text => generateEmbedding(text))
    );
    return embeddings;
  } catch (error) {
    logger.error('Batch embedding generation error:', error);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
};

/**
 * Calculate cosine similarity between two embeddings
 * @param {Array<number>} embedding1
 * @param {Array<number>} embedding2
 * @returns {number}
 */
const cosineSimilarity = (embedding1, embedding2) => {
  if (embedding1.length !== embedding2.length) {
    return 0;
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
};

module.exports = {
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity,
};




