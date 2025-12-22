#!/bin/bash
# Script to start Expo with proper file limits

# Increase file descriptor limit
ulimit -n 4096

# Check if watchman is installed
if command -v watchman &> /dev/null; then
    echo "✅ Watchman found"
    # Clear watchman cache
    watchman watch-del-all 2>/dev/null || true
else
    echo "⚠️  Watchman not installed. Installing..."
    if command -v brew &> /dev/null; then
        brew install watchman
    else
        echo "❌ Homebrew not found. Please install watchman manually:"
        echo "   brew install watchman"
    fi
fi

# Clear Metro cache
echo "🧹 Clearing Metro cache..."
rm -rf node_modules/.cache .expo 2>/dev/null || true

# Start Expo
echo "🚀 Starting Expo..."
npx expo start --clear



