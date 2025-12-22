# Architecture Update: YouTube Transcription Service

## Summary

The YouTube transcription workflow has been refactored to properly separate concerns between the Node.js backend and Python Whisper service. This enables production deployment on cloud platforms like Render.

## What Changed

### Before ❌

```
Node.js Backend
  ├── exec('yt-dlp ...')        # ❌ Fails on Render
  ├── exec('python3 ...')        # ❌ Fails on Render
  └── exec('ffmpeg ...')         # ❌ Not available
```

**Problems:**
- Node.js tried to run Python, yt-dlp, and ffmpeg directly
- Render doesn't allow `apt-get` or system package installation
- Build failures due to missing dependencies
- Tight coupling between services

### After ✅

```
Node.js Backend (Render)
  └── HTTP POST → FastAPI Whisper Service
            │
            ├── yt-dlp (download YouTube audio)
            ├── ffmpeg (audio conversion)
            └── faster-whisper (transcription)
```

**Benefits:**
- Clear separation of responsibilities
- Node.js only orchestrates (no Python/ffmpeg execution)
- Python service handles all heavy processing
- Works on cloud platforms (Render, Railway, VPS)
- Proper error handling and timeouts
- Automatic temp file cleanup

## File Changes

### New Files Created

1. **`whisper-service/app.py`**
   - FastAPI service with `/transcribe-youtube` endpoint
   - Handles YouTube URL → audio download → transcription
   - Includes proper error handling, timeouts, and cleanup

2. **`whisper-service/requirements.txt`**
   - All Python dependencies (fastapi, faster-whisper, yt-dlp, etc.)

3. **`whisper-service/Dockerfile`**
   - Docker configuration for easy deployment
   - Includes ffmpeg installation

4. **`whisper-service/README.md`**
   - Setup and usage instructions

5. **`whisper-service/DEPLOYMENT.md`**
   - Detailed deployment guide for Render, Railway, VPS

### Modified Files

1. **`backend/src/services/youtube.service.js`**
   - **Before**: Used `exec()` to run yt-dlp and Python scripts
   - **After**: Makes HTTP POST request to FastAPI service
   - Uses `PYTHON_AI_SERVICE_URL` from environment config
   - Proper error handling and logging

## API Endpoints

### FastAPI Service

#### `POST /transcribe-youtube`

**Request:**
```json
{
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "transcript": "Full transcript text...",
  "duration": 123.45,
  "language": "en",
  "metadata": {
    "title": "Video Title",
    "thumbnail": "https://...",
    "channel": "Channel Name",
    "language_probability": 0.99
  }
}
```

#### `GET /health`

Health check endpoint to verify service is running.

## Configuration

### Node.js Backend

Update `.env` file:

```env
PYTHON_AI_SERVICE_URL=http://localhost:8000  # Local development
# or
PYTHON_AI_SERVICE_URL=https://your-whisper-service.onrender.com  # Production
```

### FastAPI Service

Environment variables (see `whisper-service/.env.example`):

```env
PORT=8000
WHISPER_MODEL=small
WHISPER_DEVICE=cpu
WHISPER_COMPUTE_TYPE=int8
MAX_VIDEO_DURATION=900
REQUEST_TIMEOUT=600
```

## Deployment Steps

### 1. Deploy FastAPI Service

**Option A: Render (with Docker) - Recommended**

1. Create new Web Service on Render
2. Connect repository
3. Set Root Directory: `whisper-service`
4. Use Dockerfile (already created)
5. Set environment variables
6. Deploy

**Option B: Railway**

1. Create new project
2. Deploy from GitHub
3. Set Root Directory: `whisper-service`
4. Build Command: `pip install -r requirements.txt && apt-get update && apt-get install -y ffmpeg`
5. Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
6. Set environment variables

**Option C: VPS**

See `whisper-service/DEPLOYMENT.md` for detailed VPS setup.

### 2. Update Node.js Backend

1. Set `PYTHON_AI_SERVICE_URL` environment variable to your FastAPI service URL
2. Deploy Node.js backend (no changes needed to code)
3. Test the integration

## Testing

### Test FastAPI Service Locally

```bash
cd whisper-service
pip install -r requirements.txt
python app.py
```

Test health:
```bash
curl http://localhost:8000/health
```

Test transcription:
```bash
curl -X POST http://localhost:8000/transcribe-youtube \
  -H "Content-Type: application/json" \
  -d '{"youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

### Test Node.js Integration

1. Start FastAPI service locally
2. Set `PYTHON_AI_SERVICE_URL=http://localhost:8000` in Node.js `.env`
3. Start Node.js backend
4. Add a YouTube video through your API
5. Check logs for transcription status

## Migration Checklist

- [x] Create FastAPI service with `/transcribe-youtube` endpoint
- [x] Update Node.js `youtube.service.js` to use HTTP calls
- [x] Add proper error handling and logging
- [x] Create deployment documentation
- [x] Create Dockerfile for easy deployment
- [ ] Deploy FastAPI service to cloud platform
- [ ] Update Node.js backend environment variables
- [ ] Test end-to-end workflow
- [ ] Monitor logs and performance

## Troubleshooting

### Node.js can't connect to Python service

- Verify `PYTHON_AI_SERVICE_URL` is correct
- Check if Python service is running: `curl https://your-service/health`
- Check CORS configuration (currently allows all origins)

### Transcription fails

- Check Python service logs
- Verify ffmpeg is installed (if not using Docker)
- Check video URL is valid and accessible
- Verify video duration is within limits

### Timeout errors

- Increase `REQUEST_TIMEOUT` in FastAPI service
- Check video length (should be < `MAX_VIDEO_DURATION`)
- Consider using smaller Whisper model for faster transcription

## Best Practices

1. **Model Selection**: Use `small` for production (balance of speed/accuracy)
2. **Timeouts**: Set appropriate timeouts based on expected video lengths
3. **Error Handling**: All errors are properly logged and returned
4. **Cleanup**: Temporary files are automatically cleaned up
5. **Monitoring**: Monitor service logs and health endpoints
6. **Scaling**: Consider auto-scaling based on request volume

## Next Steps

1. Deploy the FastAPI service to your chosen platform
2. Update Node.js backend environment variables
3. Test the complete workflow
4. Monitor performance and adjust timeouts/models as needed
5. Consider adding rate limiting and authentication if needed

