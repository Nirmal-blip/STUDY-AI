#!/bin/bash

# Quick start script for Whisper Service

echo "🎙️  Whisper Transcription Service - Quick Start"
echo "================================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
else
    echo "✅ Dependencies already installed"
fi

# Check for ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  WARNING: ffmpeg not found. Please install it:"
    echo "   macOS: brew install ffmpeg"
    echo "   Ubuntu: sudo apt-get install ffmpeg"
    echo ""
fi

# Run the service
echo "🚀 Starting Whisper service..."
echo "   Service will be available at: http://localhost:8000"
echo "   Health check: http://localhost:8000/health"
echo "   Press Ctrl+C to stop"
echo ""

python app.py

