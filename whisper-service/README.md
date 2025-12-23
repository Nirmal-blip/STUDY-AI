# Whisper Transcription Service

FastAPI service for YouTube video transcription using faster-whisper.

## Features

- **YouTube URL Transcription**: Accepts YouTube URLs and returns transcripts
- **Audio File Upload**: Supports direct audio file transcription
- **Automatic Cleanup**: Temporary files are automatically cleaned up
- **Production Ready**: Proper error handling, timeouts, and logging
- **Native Format Support**: Downloads audio in native formats (webm, m4a, mp3, opus) without conversion

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install System Dependencies

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg
```

**On macOS:**
```bash
brew install ffmpeg
```

**On Cloud Platforms:**
- Railway: Use `apt-get` in build command
- Render: Free tier doesn't support `apt-get` (use Railway or VPS instead)
- VPS: Full control, install via apt-get

### 3. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `WHISPER_MODEL`: Model size (tiny, base, small, medium, large)
- `WHISPER_DEVICE`: cpu or cuda
- `MAX_VIDEO_DURATION`: Maximum video length in seconds (default: 900 = 15 min)

### 4. Run the Service

**Development:**
```bash
python app.py
```

**Production:**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### `POST /transcribe-youtube`

Transcribe a YouTube video from URL.

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

### `POST /transcribe`

Transcribe an uploaded audio file.

**Request:**
- Multipart form data with `audio_file` field

**Response:**
```json
{
  "transcript": "Full transcript text...",
  "duration": 123.45,
  "language": "en",
  "metadata": {
    "language_probability": 0.99
  }
}
```

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model": "small",
  "device": "cpu"
}
```

## Deployment

### Railway (Recommended)

**Build Command:**
```bash
pip install -r requirements.txt && apt-get update && apt-get install -y ffmpeg
```

**Start Command:**
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Render (Python 3)

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

**Note:** Render free tier doesn't support `apt-get`, so ffmpeg won't be available. Use Railway or VPS for full functionality.

### VPS

See `DEPLOYMENT.md` for detailed VPS setup instructions.

### Environment Variables
Set all variables from `.env.example` in your hosting platform's dashboard.

## Best Practices

1. **Timeouts**: Set appropriate `REQUEST_TIMEOUT` based on video length
2. **Model Selection**: Use `small` for production (balance of speed/accuracy)
3. **Temp Files**: Service automatically cleans up, but monitor disk space
4. **Error Handling**: All errors return proper HTTP status codes
5. **Logging**: Check logs for debugging transcription issues

## Troubleshooting

### ffmpeg not found
- Ensure ffmpeg is installed and in PATH
- On Railway: Add `apt-get install -y ffmpeg` to build command
- On Render free tier: Not supported, use Railway or VPS instead

### Model download fails
- Check internet connection
- Model files are cached in `~/.cache/huggingface/`

### Out of memory
- Use smaller Whisper model (tiny/base instead of small)
- Reduce `WHISPER_COMPUTE_TYPE` to int8

### YouTube download fails
- Check if video is available
- Some videos may be region-locked
- yt-dlp auto-updates, but may need manual update

