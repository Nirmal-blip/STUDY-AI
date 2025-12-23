require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/notebook_db',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  pythonAiServiceUrl: process.env.PYTHON_AI_SERVICE_URL || (process.env.NODE_ENV === 'production' ? 'https://study-ai-1-nigc.onrender.com' : 'http://localhost:8000'),
};

// Log Python service URL on startup for debugging
console.log('🔧 Python AI Service URL:', config.pythonAiServiceUrl);
console.log('🔧 NODE_ENV:', config.nodeEnv);
console.log('🔧 PYTHON_AI_SERVICE_URL env var:', process.env.PYTHON_AI_SERVICE_URL || 'NOT SET');

// Validate required environment variables (AI keys are optional now)
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.warn(`Warning: ${varName} is not set in environment variables`);
  }
});

module.exports = config;

