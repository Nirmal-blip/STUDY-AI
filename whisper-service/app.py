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

# ---------------- CONFIG ---------------- #

WHISPER_MODEL = "tiny.en"          # 🔥 FIXED (smallest)
WHISPER_DEVICE = "cpu"
WHISPER_COMPUTE_TYPE = "int8"
MAX_VIDEO_DURATION = 900            # 15 minutes
TEMP_DIR = Path("/tmp/whisper")

TEMP_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("whisper-service")

whisper_model: Optional[WhisperModel] = None

# ---------------- LIFESPAN ---------------- #

@asynccontextmanager
async def lifespan(app: FastAPI):
    global whisper_model
    logger.info("🚀 Loading Whisper model (tiny.en)")

    whisper_model = WhisperModel(
        WHISPER_MODEL,
        device=WHISPER_DEVICE,
        compute_type=WHISPER_COMPUTE_TYPE,
        cpu_threads=1              # 🔥 CRITICAL
    )

    logger.info("✅ Whisper loaded")
    yield
    whisper_model = None

# ---------------- APP ---------------- #

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- SCHEMAS ---------------- #

class YouTubeRequest(BaseModel):
    youtube_url: HttpUrl

class TranscribeResponse(BaseModel):
    transcript: str
    language: str
    duration: Optional[float] = None

# ---------------- HELPERS ---------------- #

def cleanup(paths):
    for p in paths:
        try:
            if os.path.exists(p):
                os.remove(p)
        except:
            pass

def download_audio(url: str, out_path: str) -> dict:
    ydl_opts = {
        "format": "bestaudio",
        "outtmpl": out_path + ".%(ext)s",
        "noplaylist": True,
        "quiet": True,
        "postprocessors": [],
        "extractaudio": False,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        if info.get("duration", 0) > MAX_VIDEO_DURATION:
            raise HTTPException(400, "Video too long")

        ydl.download([url])

        for f in os.listdir(os.path.dirname(out_path)):
            if f.startswith(os.path.basename(out_path)):
                return {
                    "audio": os.path.join(os.path.dirname(out_path), f),
                    "duration": info.get("duration"),
                }

    raise HTTPException(500, "Audio download failed")

def transcribe(audio_path: str) -> dict:
    if whisper_model is None:
        raise HTTPException(503, "Model not loaded")

    segments, info = whisper_model.transcribe(
        audio_path,
        beam_size=1,        # 🔥 LOW MEMORY
        language="en",      # 🔥 NO AUTO-DETECT
        vad_filter=True
    )

    text = " ".join([s.text for s in segments]).strip()
    return {
        "text": text,
        "language": info.language,
        "duration": info.duration,
    }

# ---------------- ROUTES ---------------- #

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": WHISPER_MODEL,
    }

@app.post("/transcribe-youtube", response_model=TranscribeResponse)
async def transcribe_youtube(
    req: YouTubeRequest,
    bg: BackgroundTasks
):
    temp_files = []

    try:
        tmp = tempfile.NamedTemporaryFile(dir=TEMP_DIR, delete=False)
        tmp.close()
        base_path = tmp.name
        temp_files.append(base_path)

        video = download_audio(str(req.youtube_url), base_path)
        audio_path = video["audio"]
        temp_files.append(audio_path)

        result = transcribe(audio_path)

        bg.add_task(cleanup, temp_files)

        return {
            "transcript": result["text"],
            "language": result["language"],
            "duration": video["duration"],
        }

    except HTTPException:
        raise
    except Exception as e:
        bg.add_task(cleanup, temp_files)
        raise HTTPException(500, str(e))

@app.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_file(
    bg: BackgroundTasks,
    file: UploadFile = File(...)
):
    temp_files = []

    try:
        tmp = tempfile.NamedTemporaryFile(
            dir=TEMP_DIR,
            suffix=os.path.splitext(file.filename)[1],
            delete=False
        )
        with open(tmp.name, "wb") as f:
            shutil.copyfileobj(file.file, f)

        temp_files.append(tmp.name)

        result = transcribe(tmp.name)

        bg.add_task(cleanup, temp_files)

        return {
            "transcript": result["text"],
            "language": result["language"],
            "duration": result["duration"],
        }

    except HTTPException:
        raise
    except Exception as e:
        bg.add_task(cleanup, temp_files)
        raise HTTPException(500, str(e))
