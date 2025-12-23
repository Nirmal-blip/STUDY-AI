# Whisper Service Integration Setup

## Your Whisper Service URL

**Production URL**: `https://study-ai-1-nigc.onrender.com`

## Setup Instructions

### If Backend is on Render

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Find your backend service

2. **Add Environment Variable**
   - Click on your backend service
   - Go to "Environment" tab
   - Click "Add Environment Variable"
   - **Key**: `PYTHON_AI_SERVICE_URL`
   - **Value**: `https://study-ai-1-nigc.onrender.com`
   - Click "Save Changes"

3. **Redeploy** (if needed)
   - Render will automatically redeploy when you save environment variables
   - Or manually trigger a redeploy

### If Backend is Local

1. **Update `.env` file**
   ```bash
   cd backend
   nano .env
   ```
   
   Add or update:
   ```env
   PYTHON_AI_SERVICE_URL=https://study-ai-1-nigc.onrender.com
   ```

2. **Restart Backend**
   ```bash
   npm run dev
   # or
   npm start
   ```

### If Backend is on Railway/VPS

1. **Add Environment Variable**
   - Railway: Go to Variables tab, add `PYTHON_AI_SERVICE_URL=https://study-ai-1-nigc.onrender.com`
   - VPS: Add to `.env` file or systemd service environment

2. **Restart Service**
   - Railway: Auto-restarts
   - VPS: `sudo systemctl restart notebook-backend`

## Verify Connection

Test that your backend can reach the Whisper service:

```bash
# From your backend server or locally
curl https://study-ai-1-nigc.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "model": "small",
  "device": "cpu"
}
```

## Test YouTube Transcription

1. **Add a YouTube video** from your frontend
2. **Check backend logs** for:
   ```
   Requesting transcription for YouTube video: VIDEO_ID
   Using Python service: https://study-ai-1-nigc.onrender.com
   ✅ Transcription completed for VIDEO_ID
   ```

3. **Verify in database** that video status is "ready"

## Troubleshooting

### Connection Refused

**Error**: `ECONNREFUSED` or connection timeout

**Solutions**:
- Verify Whisper service is running: `curl https://study-ai-1-nigc.onrender.com/health`
- Check if service is spun down (free tier): First request after 15 min inactivity takes 30-60 seconds
- Verify `PYTHON_AI_SERVICE_URL` is set correctly (no trailing slash)
- Check backend logs for detailed error messages

### Service Unavailable

**Error**: `503 Service Unavailable`

**Solutions**:
- Whisper service might be starting up (check Render dashboard)
- Model might still be loading (wait 1-2 minutes)
- Check Whisper service logs in Render dashboard

### Timeout Errors

**Error**: Request timeout

**Solutions**:
- Video might be too long (default max: 15 minutes)
- Whisper service might be overloaded
- Check video duration before processing

## Current Configuration

- **Whisper Service URL**: `https://study-ai-1-nigc.onrender.com`
- **Backend Config**: Uses `PYTHON_AI_SERVICE_URL` environment variable
- **Fallback**: If not set, uses `http://localhost:8000` (for local dev)

## Quick Test

Test the integration:

```bash
# Test from your backend (replace with your backend URL)
curl -X POST https://your-backend-url/api/video/add \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{"youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

Then check backend logs to see if it successfully calls the Whisper service.

