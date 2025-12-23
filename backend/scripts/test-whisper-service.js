#!/usr/bin/env node

/**
 * Test script to verify Whisper service connection
 * Usage: node scripts/test-whisper-service.js
 */

require('dotenv').config();
const axios = require('axios');
const config = require('../src/config/env');

const WHISPER_SERVICE_URL = config.pythonAiServiceUrl;
const TEST_VIDEO_ID = 'dQw4w9WgXcQ'; // Short test video

console.log('\n🔍 Whisper Service Connection Test\n');
console.log('=' .repeat(50));
console.log(`Environment: ${config.nodeEnv}`);
console.log(`Python Service URL: ${WHISPER_SERVICE_URL}`);
console.log(`PYTHON_AI_SERVICE_URL env var: ${process.env.PYTHON_AI_SERVICE_URL || 'NOT SET'}`);
console.log('=' .repeat(50));
console.log('');

// Test 1: Health Check
async function testHealthCheck() {
  console.log('📋 Test 1: Health Check');
  console.log(`   GET ${WHISPER_SERVICE_URL}/health`);
  
  try {
    const response = await axios.get(`${WHISPER_SERVICE_URL}/health`, {
      timeout: 10000
    });
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   ✅ Response:`, JSON.stringify(response.data, null, 2));
    return true;
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}`);
    if (err.code) console.log(`   ❌ Error Code: ${err.code}`);
    if (err.response) {
      console.log(`   ❌ Status: ${err.response.status}`);
      console.log(`   ❌ Data:`, JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}

// Test 2: Transcribe Endpoint (without actually transcribing)
async function testTranscribeEndpoint() {
  console.log('\n📋 Test 2: Transcribe Endpoint Check');
  console.log(`   POST ${WHISPER_SERVICE_URL}/transcribe-youtube`);
  
  try {
    // Use a very short test video
    const response = await axios.post(
      `${WHISPER_SERVICE_URL}/transcribe-youtube`,
      {
        youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEO_ID}`
      },
      {
        timeout: 30000, // 30 seconds for quick test
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`   ✅ Status: ${response.status}`);
    if (response.data.transcript) {
      console.log(`   ✅ Transcript received (${response.data.transcript.length} chars)`);
    } else {
      console.log(`   ⚠️  Response received but no transcript:`, JSON.stringify(response.data, null, 2));
    }
    return true;
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}`);
    if (err.code) console.log(`   ❌ Error Code: ${err.code}`);
    if (err.response) {
      console.log(`   ❌ Status: ${err.response.status}`);
      console.log(`   ❌ Data:`, JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}

// Test 3: Configuration Check
function testConfiguration() {
  console.log('\n📋 Test 3: Configuration Check');
  
  const issues = [];
  
  if (!WHISPER_SERVICE_URL || WHISPER_SERVICE_URL === 'undefined') {
    issues.push('❌ Python service URL is not set');
  } else if (WHISPER_SERVICE_URL === 'http://localhost:8000' && config.nodeEnv === 'production') {
    issues.push('⚠️  Using localhost URL in production - should use production URL');
  } else if (!WHISPER_SERVICE_URL.startsWith('http')) {
    issues.push('❌ Python service URL is not a valid HTTP URL');
  } else {
    console.log('   ✅ Configuration looks good');
  }
  
  if (issues.length > 0) {
    issues.forEach(issue => console.log(`   ${issue}`));
    return false;
  }
  
  return true;
}

// Run all tests
async function runTests() {
  const configOk = testConfiguration();
  
  if (!configOk) {
    console.log('\n❌ Configuration issues detected. Fix these first.\n');
    process.exit(1);
  }
  
  const healthOk = await testHealthCheck();
  
  if (!healthOk) {
    console.log('\n❌ Health check failed. Service may be down or unreachable.\n');
    console.log('💡 Troubleshooting:');
    console.log('   1. Check if service is deployed: curl', WHISPER_SERVICE_URL + '/health');
    console.log('   2. Verify PYTHON_AI_SERVICE_URL is set correctly');
    console.log('   3. Check network connectivity');
    process.exit(1);
  }
  
  console.log('\n⏳ Testing transcription endpoint (this may take 30-60 seconds)...');
  const transcribeOk = await testTranscribeEndpoint();
  
  console.log('\n' + '='.repeat(50));
  if (healthOk && transcribeOk) {
    console.log('✅ All tests passed! Whisper service is working correctly.');
  } else if (healthOk) {
    console.log('⚠️  Health check passed but transcription test failed.');
    console.log('   This might be normal if the service is starting up or the video is too long.');
  }
  console.log('='.repeat(50) + '\n');
  
  process.exit(transcribeOk ? 0 : 1);
}

runTests().catch(err => {
  console.error('\n❌ Test script error:', err);
  process.exit(1);
});

