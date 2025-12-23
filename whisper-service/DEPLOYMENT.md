# Whisper Service Deployment Guide

## Overview

This guide covers deploying the FastAPI Whisper service on cloud platforms like Render, Railway, or VPS.

## Architecture

```
Node.js Backend (Render)
    ↓ HTTP Request
FastAPI Whisper Service (Render/Railway/VPS)
    ↓ yt-dlp + faster-whisper
YouTube Video → Audio → Transcript
```

## Deployment Options

### Option 1: Render with Docker (Recommended - Easiest)

Docker handles all dependencies automatically, including ffmpeg.

#### Dockerfile

The `Dockerfile` is already created in `whisper-service/`:

```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    pkg-config \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Render Configuration

1. **New Web Service**
   - Connect your repository
   - Root Directory: `whisper-service`
   - Environment: **Docker** ⚠️ **CRITICAL**
   - Docker Build Context Directory: `whisper-service`
   - Dockerfile Path: `Dockerfile`
   - Build Command: (leave empty - Docker handles it)
   - Start Command: (leave empty - Docker handles it)

2. **Environment Variables**
   ```
   PORT=8000
   HOST=0.0.0.0
   ENV=production
   WHISPER_MODEL=small
   WHISPER_DEVICE=cpu
   WHISPER_COMPUTE_TYPE=int8
   MAX_VIDEO_DURATION=900
   REQUEST_TIMEOUT=600
   TEMP_DIR=/tmp/whisper-service
   ```

3. **Update Node.js Backend**
   - Set `PYTHON_AI_SERVICE_URL` to your Render service URL
   - Example: `https://whisper-service.onrender.com`

**See `RENDER_DEPLOY_DOCKER.md` for detailed step-by-step instructions.**

### Option 2: Railway (Alternative - Supports ffmpeg)

Railway supports system packages and is easy to deploy.

#### Railway Configuration

1. **New Project → Deploy from GitHub**
2. **Root Directory**: `whisper-service`
3. **Build Command**: `pip install -r requirements.txt && apt-get update && apt-get install -y ffmpeg`
4. **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**: 
   ```
   WHISPER_MODEL=small
   WHISPER_DEVICE=cpu
   WHISPER_COMPUTE_TYPE=int8
   MAX_VIDEO_DURATION=900
   REQUEST_TIMEOUT=600
   TEMP_DIR=/tmp/whisper-service
   ENV=production
   ```

6. **Update Node.js Backend**
   - Set `PYTHON_AI_SERVICE_URL` to your Railway service URL
   - Example: `https://whisper-service.up.railway.app`

### Option 2: Render (Python 3)

Render free tier has limitations with system packages.

#### Render Configuration

1. **New Web Service**
   - Connect your repository
   - Root Directory: `whisper-service`
   - Environment: **Python 3** (NOT Docker)
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables**
   ```
   WHISPER_MODEL=small
   WHISPER_DEVICE=cpu
   WHISPER_COMPUTE_TYPE=int8
   MAX_VIDEO_DURATION=900
   REQUEST_TIMEOUT=600
   TEMP_DIR=/tmp/whisper-service
   ENV=production
   ```

3. **⚠️ Limitation**: Render free tier doesn't support `apt-get`, so ffmpeg won't be installed. YouTube downloads will fail. Use Railway or VPS instead.

4. **Update Node.js Backend**
   - Set `PYTHON_AI_SERVICE_URL` to your Render service URL
   - Example: `https://whisper-service.onrender.com`

### Option 3: VPS (Ubuntu/Debian) - Full Control

#### Setup Script

```bash
#!/bin/bash

# Update system
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv ffmpeg

# Create virtual environment
cd /opt/whisper-service
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create systemd service
sudo nano /etc/systemd/system/whisper-service.service
```

#### Systemd Service File

```ini
[Unit]
Description=Whisper Transcription Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/whisper-service
Environment="PATH=/opt/whisper-service/venv/bin"
ExecStart=/opt/whisper-service/venv/bin/uvicorn app:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

#### Enable and Start

```bash
sudo systemctl enable whisper-service
sudo systemctl start whisper-service
sudo systemctl status whisper-service
```

### Option 4: Render (Without Docker - Limited)

If you can't use Docker, try this (may not work due to Render restrictions):

1. **Build Command**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start Command**:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port $PORT
   ```

3. **Note**: You'll need ffmpeg pre-installed. Render may not allow `apt-get`.

## Environment Variables

### Required

- `PORT`: Server port (default: 8000)
- `HOST`: Server host (default: 0.0.0.0)

### Optional

- `WHISPER_MODEL`: Model size - tiny, base, small, medium, large (default: small)
- `WHISPER_DEVICE`: cpu or cuda (default: cpu)
- `WHISPER_COMPUTE_TYPE`: int8, int8_float16, float16, float32 (default: int8)
- `MAX_VIDEO_DURATION`: Max video length in seconds (default: 900 = 15 min)
- `REQUEST_TIMEOUT`: Request timeout in seconds (default: 600 = 10 min)
- `TEMP_DIR`: Temporary file directory (default: /tmp/whisper-service)
- `ENV`: Environment - development or production (default: production)

## Node.js Backend Configuration

Update your Node.js backend `.env`:

```env
PYTHON_AI_SERVICE_URL=https://your-whisper-service.onrender.com
```

Or for local development:

```env
PYTHON_AI_SERVICE_URL=http://localhost:8000
```

## Testing

### Test Health Endpoint

```bash
curl https://your-whisper-service.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "model": "small",
  "device": "cpu"
}
```

### Test YouTube Transcription

```bash
curl -X POST https://your-whisper-service.onrender.com/transcribe-youtube \
  -H "Content-Type: application/json" \
  -d '{"youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## Troubleshooting

### Issue: ffmpeg not found

**Solution**: 
- Use Docker (Option 1) - includes ffmpeg
- Use Railway (Option 2) - supports apt-get
- Use VPS (Option 3) - full control

### Issue: Model download fails

**Solution**:
- Check internet connectivity
- Models are cached in `~/.cache/huggingface/`
- First request will be slower (model download)

### Issue: Out of memory

**Solution**:
- Use smaller model: `WHISPER_MODEL=tiny` or `base`
- Reduce compute type: `WHISPER_COMPUTE_TYPE=int8`
- Increase service memory allocation

### Issue: Request timeout

**Solution**:
- Increase `REQUEST_TIMEOUT` environment variable
- Check video length (should be < `MAX_VIDEO_DURATION`)
- Optimize model size

### Issue: Connection refused from Node.js

**Solution**:
- Verify `PYTHON_AI_SERVICE_URL` is correct
- Check if service is running: `curl https://your-service/health`
- Ensure CORS is configured (already set to allow all origins)

## Monitoring

### Logs

Check service logs for:
- Model loading status
- Transcription progress
- Error messages
- Cleanup operations

### Metrics to Monitor

- Request count
- Average transcription time
- Error rate
- Memory usage
- Disk space (temp files)

## Security Considerations

1. **CORS**: Currently allows all origins. Restrict in production:
   ```python
   allow_origins=["https://your-frontend.com"]
   ```

2. **Rate Limiting**: Consider adding rate limiting for production

3. **Authentication**: Add API key authentication if needed

4. **Input Validation**: YouTube URL validation is handled by Pydantic

## Cost Optimization

1. **Model Selection**: Use `tiny` or `base` for faster/cheaper transcription
2. **Compute Type**: `int8` is most efficient for CPU
3. **Caching**: Consider caching transcripts for repeated requests
4. **Auto-scaling**: Configure auto-scaling based on request volume

