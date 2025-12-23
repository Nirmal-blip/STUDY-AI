"""
FastAPI service for YouTube video transcription using faster-whisper.

This service handles:
- YouTube URL → audio download (yt-dlp)
- Audio extraction and conversion
- Whisper transcription
- Cleanup of temporary files
"""

import os
import tempfile
import shutil
from pathlib import Path
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import yt_dlp
from faster_whisper import WhisperModel
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "tiny.en")
WHISPER_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
WHISPER_COMPUTE_TYPE = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
MAX_VIDEO_DURATION = int(os.getenv("MAX_VIDEO_DURATION", "900"))  # 15 minutes default
TEMP_DIR = Path(os.getenv("TEMP_DIR", "/tmp/whisper-service"))
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "600"))  # 10 minutes default

# Create temp directory if it doesn't exist
TEMP_DIR.mkdir(parents=True, exist_ok=True)

# Global Whisper model (loaded once at startup)
whisper_model: Optional[WhisperModel] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load Whisper model at startup, cleanup at shutdown."""
    global whisper_model
    logger.info(f"Loading Whisper model: {WHISPER_MODEL} on {WHISPER_DEVICE}")
    try:
        whisper_model = WhisperModel(
            WHISPER_MODEL,
            device=WHISPER_DEVICE,
            compute_type=WHISPER_COMPUTE_TYPE
        )
        logger.info("✅ Whisper model loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load Whisper model: {e}")
        raise
    
    yield
    
    # Cleanup on shutdown
    logger.info("Shutting down Whisper service...")
    whisper_model = None
    # Clean up temp directory
    try:
        if TEMP_DIR.exists():
            shutil.rmtree(TEMP_DIR)
            logger.info("Cleaned up temp directory")
    except Exception as e:
        logger.warning(f"Failed to cleanup temp directory: {e}")


app = FastAPI(
    title="Whisper Transcription Service",
    description="FastAPI service for YouTube video transcription using faster-whisper",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class TranscribeYouTubeRequest(BaseModel):
    youtube_url: HttpUrl
    model: Optional[str] = None  # Override default model if needed


class TranscribeYouTubeResponse(BaseModel):
    transcript: str
    duration: Optional[float] = None
    language: Optional[str] = None
    metadata: Optional[dict] = None


class HealthResponse(BaseModel):
    status: str
    model: str
    device: str


def cleanup_temp_files(file_paths: list):
    """Clean up temporary files in background."""
    for file_path in file_paths:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Cleaned up: {file_path}")
        except Exception as e:
            logger.warning(f"Failed to cleanup {file_path}: {e}")


def download_youtube_audio(youtube_url: str, output_path: str) -> dict:
    """
    Download audio from YouTube video using yt-dlp.
    
    Returns:
        dict: Video metadata including duration, title, etc.
    """
    # Get ffmpeg/ffprobe paths from environment or use system PATH
    ffmpeg_path = os.getenv('FFMPEG_PATH', 'ffmpeg')
    ffprobe_path = os.getenv('FFPROBE_PATH', 'ffprobe')
    
    # faster-whisper can handle many formats, so download raw audio without conversion
    # Use format selector that gets actual downloadable audio files
    ydl_opts = {
        # Select best audio format that's directly downloadable (not a stream that needs extraction)
        # This avoids formats like "251-8" which are opus streams that need postprocessing
        'format': 'bestaudio[ext=webm]/bestaudio[ext=m4a]/bestaudio[ext=mp3]/bestaudio[ext=opus]/bestaudio',
        'outtmpl': output_path + '.%(ext)s',  # Let yt-dlp add the extension automatically
        'quiet': False,
        'no_warnings': False,
        'noplaylist': True,
        # CRITICAL: Explicitly disable postprocessing - faster-whisper handles native formats
        'postprocessors': [],
        # Don't try to extract audio from video containers
        'extractaudio': False,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract info first to check duration
            info = ydl.extract_info(youtube_url, download=False)
            duration = info.get('duration', 0)
            
            if duration > MAX_VIDEO_DURATION:
                raise ValueError(
                    f"Video duration ({duration}s) exceeds maximum allowed duration ({MAX_VIDEO_DURATION}s)"
                )
            
            # Download the audio
            logger.info(f"Downloading audio from: {youtube_url}")
            ydl.download([youtube_url])
            
            # Find the actual output file (yt-dlp adds extension based on format)
            actual_output = None
            parent_dir = os.path.dirname(output_path)
            base_name = os.path.basename(output_path)
            
            if os.path.exists(parent_dir):
                # Look for files starting with the base name
                for file in os.listdir(parent_dir):
                    if file.startswith(base_name):
                        candidate = os.path.join(parent_dir, file)
                        # Check file size - must be > 0
                        if os.path.getsize(candidate) > 0:
                            actual_output = candidate
                            break
            
            if not os.path.exists(actual_output):
                raise FileNotFoundError(f"Downloaded audio file not found: {actual_output}")
            
            # Validate file has content
            file_size = os.path.getsize(actual_output)
            if file_size == 0:
                raise ValueError(f"Downloaded audio file is empty: {actual_output}")
            
            logger.info(f"✅ Audio downloaded: {actual_output} ({file_size} bytes)")
            
            return {
                'duration': duration,
                'title': info.get('title', ''),
                'thumbnail': info.get('thumbnail', ''),
                'channel': info.get('channel', ''),
                'audio_path': actual_output
            }
            
    except yt_dlp.utils.DownloadError as e:
        logger.error(f"yt-dlp download error: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to download video: {str(e)}")
    except Exception as e:
        logger.error(f"Download error: {e}")
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")


def transcribe_audio(audio_path: str, model_override: Optional[str] = None) -> dict:
    """
    Transcribe audio file using Whisper.
    
    Returns:
        dict: Transcription result with text, language, and segments
    """
    if whisper_model is None:
        raise HTTPException(status_code=503, detail="Whisper model not loaded")
    
    # Validate file exists and has content
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=400, detail=f"Audio file not found: {audio_path}")
    
    file_size = os.path.getsize(audio_path)
    if file_size == 0:
        raise HTTPException(status_code=400, detail=f"Audio file is empty: {audio_path}")
    
    logger.info(f"Transcribing audio: {audio_path} ({file_size} bytes)")
    
    model_to_use = whisper_model
    if model_override and model_override != WHISPER_MODEL:
        # Load different model if requested (not recommended for production)
        logger.warning(f"Loading override model: {model_override}")
        model_to_use = WhisperModel(
            model_override,
            device=WHISPER_DEVICE,
            compute_type=WHISPER_COMPUTE_TYPE
        )
    
    try:
        segments, info = model_to_use.transcribe(
            audio_path,
            beam_size=5,
            language=None,  # Auto-detect
        )
        
        # Combine all segments into full transcript
        transcript_text = ""
        for segment in segments:
            transcript_text += segment.text + " "
        
        transcript_text = transcript_text.strip()
        
        logger.info(f"✅ Transcription completed. Language: {info.language}, Duration: {info.duration:.2f}s")
        
        return {
            'transcript': transcript_text,
            'language': info.language,
            'duration': info.duration,
            'language_probability': info.language_probability
        }
        
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint - health check."""
    return {
        "status": "healthy",
        "model": WHISPER_MODEL,
        "device": WHISPER_DEVICE
    }


@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy" if whisper_model is not None else "unhealthy",
        "model": WHISPER_MODEL,
        "device": WHISPER_DEVICE
    }


@app.post("/transcribe-youtube", response_model=TranscribeYouTubeResponse)
async def transcribe_youtube(
    request: TranscribeYouTubeRequest,
    background_tasks: BackgroundTasks
):
    """
    Transcribe a YouTube video from URL.
    
    Process:
    1. Download audio from YouTube URL
    2. Extract/convert audio to WAV
    3. Transcribe using Whisper
    4. Clean up temporary files
    """
    temp_files_to_cleanup = []
    
    try:
        # Create temporary file for audio
        temp_file = tempfile.NamedTemporaryFile(
            dir=TEMP_DIR,
            prefix="youtube_",
            suffix=".wav",
            delete=False
        )
        temp_file.close()
        temp_audio_path = temp_file.name
        temp_files_to_cleanup.append(temp_audio_path)
        
        # Download YouTube audio
        youtube_url_str = str(request.youtube_url)
        logger.info(f"Processing YouTube URL: {youtube_url_str}")
        
        video_info = download_youtube_audio(youtube_url_str, temp_audio_path)
        audio_path = video_info['audio_path']
        
        # Ensure audio file is in cleanup list
        if audio_path not in temp_files_to_cleanup:
            temp_files_to_cleanup.append(audio_path)
        
        # Transcribe audio
        transcription_result = transcribe_audio(audio_path, request.model)
        
        # Schedule cleanup
        background_tasks.add_task(cleanup_temp_files, temp_files_to_cleanup)
        
        return TranscribeYouTubeResponse(
            transcript=transcription_result['transcript'],
            duration=transcription_result.get('duration') or video_info.get('duration'),
            language=transcription_result.get('language'),
            metadata={
                'title': video_info.get('title'),
                'thumbnail': video_info.get('thumbnail'),
                'channel': video_info.get('channel'),
                'language_probability': transcription_result.get('language_probability')
            }
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error in transcribe_youtube: {e}")
        # Cleanup on error
        background_tasks.add_task(cleanup_temp_files, temp_files_to_cleanup)
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}"
        )


@app.post("/transcribe", response_model=TranscribeYouTubeResponse)
async def transcribe_audio_file(
    background_tasks: BackgroundTasks,
    audio_file: UploadFile = File(...)
):
    """
    Transcribe an uploaded audio file.
    
    This endpoint accepts audio file uploads and transcribes them.
    """
    temp_files_to_cleanup = []
    
    try:
        # Save uploaded file temporarily
        temp_file = tempfile.NamedTemporaryFile(
            dir=TEMP_DIR,
            prefix="upload_",
            suffix=os.path.splitext(audio_file.filename)[1] or ".wav",
            delete=False
        )
        temp_audio_path = temp_file.name
        temp_files_to_cleanup.append(temp_audio_path)
        
        # Write uploaded file to temp location
        with open(temp_audio_path, "wb") as f:
            shutil.copyfileobj(audio_file.file, f)
        
        logger.info(f"Saved uploaded audio: {temp_audio_path}")
        
        # Transcribe audio
        transcription_result = transcribe_audio(temp_audio_path)
        
        # Schedule cleanup
        background_tasks.add_task(cleanup_temp_files, temp_files_to_cleanup)
        
        return TranscribeYouTubeResponse(
            transcript=transcription_result['transcript'],
            duration=transcription_result.get('duration'),
            language=transcription_result.get('language'),
            metadata={
                'language_probability': transcription_result.get('language_probability')
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in transcribe_audio_file: {e}")
        background_tasks.add_task(cleanup_temp_files, temp_files_to_cleanup)
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=os.getenv("ENV", "production") != "production"
    )

