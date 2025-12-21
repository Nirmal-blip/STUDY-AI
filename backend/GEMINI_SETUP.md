# Gemini API Setup Guide

## How to Get Your Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey
   - Or: https://makersuite.google.com/app/apikey

2. **Sign in with your Google account**

3. **Create API Key**
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - Copy the generated API key

4. **Add to Backend .env**
   ```env
   GEMINI_API_KEY=your-actual-api-key-here
   ```

5. **Restart Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

## Features Using Gemini

- ✅ PDF Summary Generation
- ✅ Text Note Summary Generation
- ✅ YouTube Video Summary & Key Points
- ✅ AI Chat Responses
- ✅ Teacher-Student Dialogue
- ✅ Key Points Extraction

## Benefits of Gemini

- **Free Tier**: Generous free usage limits
- **Better Context**: Can handle longer text (up to 30,000 characters)
- **Fast Responses**: Quick generation times
- **Cost Effective**: More affordable than OpenAI for many use cases

## Testing

Once you add your API key, try uploading a PDF or adding a YouTube video. The summaries will be automatically generated using Gemini!

## Troubleshooting

- **"Gemini API not configured"**: Make sure GEMINI_API_KEY is set in .env
- **"Invalid API key"**: Verify your API key is correct
- **Rate limits**: Check your Google Cloud quota if you hit limits
