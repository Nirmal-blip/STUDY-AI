# Quick Start Guide - Running the Whisper Service Locally

## Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- ffmpeg (for audio processing)

### Install ffmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use:
```bash
choco install ffmpeg
```

## Step-by-Step Setup

### 1. Navigate to the whisper-service directory

```bash
cd whisper-service
```

### 2. Create a Python virtual environment

**macOS/Linux:**
```bash
python3 -m venv venv
```

**Windows:**
```bash
python -m venv venv
```

### 3. Activate the virtual environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows (Command Prompt):**
```bash
venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

You should see `(venv)` in your terminal prompt, indicating the virtual environment is active.

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI and Uvicorn (web server)
- faster-whisper (Whisper transcription)
- yt-dlp (YouTube downloader)
- Other required packages

**Note:** The first time you run this, faster-whisper will download the Whisper model (this may take a few minutes).

### 5. (Optional) Set up environment variables

Create a `.env` file (or copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults are usually fine for local development).

### 6. Run the service

```bash
python app.py
```

Or using uvicorn directly:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The `--reload` flag enables auto-reload during development.

You should see output like:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Loading Whisper model: small on cpu
INFO:     ✅ Whisper model loaded successfully
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 7. Test the service

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "model": "small",
  "device": "cpu"
}
```

## Running in Development vs Production

### Development Mode (with auto-reload)

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Production Mode

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

Or simply:
```bash
python app.py
```

## Testing the Transcription Endpoint

### Test with a YouTube URL

```bash
curl -X POST http://localhost:8000/transcribe-youtube \
  -H "Content-Type: application/json" \
  -d '{"youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

This will:
1. Download the audio from YouTube
2. Transcribe it using Whisper
3. Return the transcript as JSON

**Note:** The first transcription may take longer as the model processes the audio.

## Common Issues

### Issue: `python3: command not found`

**Solution:**
- Use `python` instead of `python3` (Windows)
- Install Python 3.11+ from [python.org](https://www.python.org/downloads/)

### Issue: `ffmpeg: command not found`

**Solution:**
- Install ffmpeg (see Prerequisites above)
- Verify installation: `ffmpeg -version`

### Issue: `ModuleNotFoundError` when running

**Solution:**
- Make sure virtual environment is activated (you should see `(venv)`)
- Reinstall dependencies: `pip install -r requirements.txt`

### Issue: Model download is slow

**Solution:**
- This is normal on first run
- Models are cached in `~/.cache/huggingface/`
- Subsequent runs will be faster

### Issue: Port 8000 already in use

**Solution:**
- Use a different port: `uvicorn app:app --port 8001`
- Or kill the process using port 8000:
  ```bash
  # macOS/Linux
  lsof -ti:8000 | xargs kill
  
  # Windows
  netstat -ano | findstr :8000
  taskkill /PID <PID> /F
  ```

## Deactivating the Virtual Environment

When you're done working:

```bash
deactivate
```

## Next Steps

1. **Connect Node.js Backend:**
   - Set `PYTHON_AI_SERVICE_URL=http://localhost:8000` in your Node.js `.env`
   - Start your Node.js backend
   - Test adding a YouTube video

2. **Deploy to Production:**
   - See `DEPLOYMENT.md` for cloud deployment instructions
   - Use Docker for easiest deployment

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8000 | Server port |
| `HOST` | 0.0.0.0 | Server host |
| `WHISPER_MODEL` | small | Whisper model size (tiny, base, small, medium, large) |
| `WHISPER_DEVICE` | cpu | Device (cpu or cuda) |
| `WHISPER_COMPUTE_TYPE` | int8 | Compute type |
| `MAX_VIDEO_DURATION` | 900 | Max video length in seconds (15 min) |
| `REQUEST_TIMEOUT` | 600 | Request timeout in seconds (10 min) |
| `TEMP_DIR` | /tmp/whisper-service | Temporary files directory |

## Useful Commands

```bash
# Check Python version
python --version

# Check if virtual environment is active
which python  # Should show path to venv/bin/python

# List installed packages
pip list

# Update a package
pip install --upgrade package-name

# View service logs
# (Logs appear in terminal where you ran the service)
```

