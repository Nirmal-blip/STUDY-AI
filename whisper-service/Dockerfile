FROM python:3.11-slim

# Install system dependencies (ffmpeg is required for yt-dlp)
# pkg-config and build tools may be needed for some Python packages
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    pkg-config \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (for better Docker layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py .

# Create temp directory
RUN mkdir -p /tmp/whisper-service

# Expose port
EXPOSE 8000

# Health check (using curl which is available in the image)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

