# Debugging Whisper Service Connection

## Issues Fixed

1. **Syntax Error in `env.js`**: Fixed incorrect `||` operator usage
2. **Redundant Fallback**: Removed hardcoded fallback in `youtube.service.js` that was overriding config
3. **Added Comprehensive Logging**: Now logs the exact URL being used at startup and during requests

## How to Debug

### Step 1: Check Backend Logs on Startup

When your backend starts, you should now see:
```
🔧 Python AI Service URL: https://study-ai-1-nigc.onrender.com
🔧 NODE_ENV: production
🔧 PYTHON_AI_SERVICE_URL env var: https://study-ai-1-nigc.onrender.com
```

**If you see `http://localhost:8000` in production**, the environment variable is not set on Render.

### Step 2: Run Test Script

Test the connection locally or on your server:

```bash
cd backend
node scripts/test-whisper-service.js
```

This will:
- Check configuration
- Test health endpoint
- Test transcription endpoint

### Step 3: Check Render Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Go to "Environment" tab
4. Verify `PYTHON_AI_SERVICE_URL` is set to: `https://study-ai-1-nigc.onrender.com`
5. **Important**: Make sure there's no trailing slash
6. Save and redeploy if needed

### Step 4: Check Backend Logs During Transcription

When a video is being transcribed, you should see:
```
🎬 Requesting transcription for YouTube video: VIDEO_ID
🌐 Using Python service URL: https://study-ai-1-nigc.onrender.com
📹 YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
🔍 Full endpoint: https://study-ai-1-nigc.onrender.com/transcribe-youtube
📤 Sending POST request to: https://study-ai-1-nigc.onrender.com/transcribe-youtube
```

**If you see `http://localhost:8000`**, the environment variable is not being read.

## Common Issues

### Issue 1: Environment Variable Not Set on Render

**Symptoms:**
- Logs show `http://localhost:8000`
- Connection refused errors

**Solution:**
1. Set `PYTHON_AI_SERVICE_URL=https://study-ai-1-nigc.onrender.com` in Render
2. Redeploy backend

### Issue 2: Service Spun Down (Free Tier)

**Symptoms:**
- First request after 15 min inactivity times out
- Takes 30-60 seconds to respond

**Solution:**
- This is normal for Render free tier
- Wait for service to wake up
- Consider upgrading to paid tier for always-on service

### Issue 3: CORS Issues

**Symptoms:**
- Network errors
- CORS errors in browser console

**Solution:**
- Check Whisper service CORS settings
- Verify backend URL is allowed

### Issue 4: Wrong Endpoint

**Symptoms:**
- 404 errors
- "Endpoint not found" in logs

**Solution:**
- Verify endpoint is `/transcribe-youtube` (not `/api/transcribe-youtube`)
- Check Whisper service routes

## Manual Test

Test the connection manually:

```bash
# Test health endpoint
curl https://study-ai-1-nigc.onrender.com/health

# Test transcription (replace VIDEO_ID)
curl -X POST https://study-ai-1-nigc.onrender.com/transcribe-youtube \
  -H "Content-Type: application/json" \
  -d '{"youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## What Was Changed

### `backend/src/config/env.js`
- Fixed syntax error
- Added production fallback to use Render URL if env var not set
- Added startup logging

### `backend/src/services/youtube.service.js`
- Removed redundant fallback that was overriding config
- Added detailed logging for debugging
- Improved error messages with full context

### New Files
- `backend/scripts/test-whisper-service.js` - Test script
- `backend/DEBUG_WHISPER_SERVICE.md` - This file

## Next Steps

1. **Set Environment Variable on Render** (if not already set)
2. **Redeploy Backend** (if needed)
3. **Check Logs** when adding a video
4. **Run Test Script** to verify connection
5. **Check Render Logs** for Whisper service status

## Still Not Working?

1. Check Render backend logs for the startup messages
2. Check Render backend logs during video transcription
3. Verify Whisper service is actually deployed and running
4. Test Whisper service directly with curl
5. Check if there are any network/firewall restrictions

