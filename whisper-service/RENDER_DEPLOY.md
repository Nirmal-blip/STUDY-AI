# Deploy Whisper Service on Render WITHOUT Docker

## Prerequisites

- GitHub account
- Render account (sign up at [render.com](https://render.com) - free tier available)
- Your code pushed to GitHub

## Step-by-Step Deployment (No Docker)

### Step 1: Push Code to GitHub

1. **Commit and push your whisper-service code:**
   ```bash
   cd /Users/shubhamjoshi/Desktop/notebook
   git add whisper-service/
   git commit -m "Add Whisper transcription service"
   git push origin main
   ```

### Step 2: Create Render Web Service

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Sign in or create an account

2. **Create New Web Service**
   - Click the **"New +"** button (top right)
   - Select **"Web Service"**

3. **Connect Repository**
   - Click **"Connect account"** if not already connected
   - Select your GitHub account
   - Choose the repository containing your code
   - Click **"Connect"**

### Step 3: Configure the Service (NO DOCKER)

Fill in the service configuration:

1. **Basic Settings:**
   - **Name**: `whisper-service` (or any name you prefer)
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `whisper-service` ⚠️ **IMPORTANT**

2. **Build & Deploy Settings:**
   - **Environment**: Select **"Python 3"** ⚠️ **NOT Docker**
   - **Python Version**: `3.11` (important - avoids Rust compilation issues)
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

   ⚠️ **Note about ffmpeg**: Render's free tier doesn't allow `apt-get` in build scripts. You have two options:
   
   **Option A: Use Render Blueprint (Recommended)**
   - Use the `render.yaml` file (already created)
   - Render will auto-detect and use it
   
   **Option B: Manual Setup**
   - ffmpeg won't be available on free tier
   - Consider using Railway or VPS instead (they support apt-get)
   - Or upgrade to Render paid plan

### Step 4: Set Environment Variables

Click on **"Environment"** tab and add these variables:

```
WHISPER_MODEL=small
WHISPER_DEVICE=cpu
WHISPER_COMPUTE_TYPE=int8
MAX_VIDEO_DURATION=900
REQUEST_TIMEOUT=600
TEMP_DIR=/tmp/whisper-service
ENV=production
```

**Note**: `PORT` is automatically set by Render, don't add it manually.

### Step 5: Deploy

1. **Review Settings**
   - Double-check Root Directory is `whisper-service`
   - Verify Environment is set to **"Python 3"** (NOT Docker)
   - Confirm all environment variables are added

2. **Create Service**
   - Click **"Create Web Service"** at the bottom
   - Render will start building your service

3. **Monitor Build**
   - Watch the build logs in real-time
   - First build takes 5-10 minutes (downloads Python packages, Whisper model, etc.)

### Step 6: Wait for Deployment

1. **Build Process:**
   - Python dependencies install
   - Whisper model downloads (first time only)

2. **Deployment:**
   - Service starts automatically
   - Health check runs
   - Service becomes available

3. **Get Your Service URL:**
   - Once deployed, you'll see: `https://whisper-service.onrender.com`
   - Or: `https://your-service-name.onrender.com`

### Step 7: Test the Service

1. **Health Check:**
   ```bash
   curl https://your-service-name.onrender.com/health
   ```
   
   Expected response:
   ```json
   {
     "status": "healthy",
     "model": "small",
     "device": "cpu"
   }
   ```

### Step 8: Update Node.js Backend

1. **Get Your Service URL:**
   - Copy the URL from Render dashboard

2. **Update Backend Environment:**
   - If backend is on Render:
     - Go to your backend service on Render
     - Click "Environment" tab
     - Add/Update: `PYTHON_AI_SERVICE_URL=https://your-whisper-service.onrender.com`
     - Save and redeploy
   
   - If backend is local:
     - Update `backend/.env`:
       ```env
       PYTHON_AI_SERVICE_URL=https://your-whisper-service.onrender.com
       ```
     - Restart your backend

## ⚠️ Important: ffmpeg Limitation on Render Free Tier

**Problem**: Render's free tier doesn't allow `apt-get` in build scripts, so ffmpeg won't be installed.

**Solutions**:

### Option 1: Use Railway Instead (Recommended for Free Tier)
Railway allows `apt-get` in build scripts:
- Go to [railway.app](https://railway.app)
- Deploy from GitHub
- Build Command: `pip install -r requirements.txt && apt-get update && apt-get install -y ffmpeg`
- Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

### Option 2: Upgrade Render Plan
- Paid Render plans may support system package installation
- Check Render documentation for current capabilities

### Option 3: Use VPS
- Full control over system packages
- See `DEPLOYMENT.md` for VPS setup

### Option 4: Try Render Blueprint
- The `render.yaml` file might help, but ffmpeg installation is still limited

## Alternative: Railway Deployment (Supports ffmpeg)

Since Render free tier has limitations, here's Railway setup:

### Railway Steps:

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - **Root Directory**: `whisper-service`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && apt-get update && apt-get install -y ffmpeg
     ```
   - **Start Command**: 
     ```bash
     uvicorn app:app --host 0.0.0.0 --port $PORT
     ```

4. **Environment Variables** (same as Render):
   ```
   WHISPER_MODEL=small
   WHISPER_DEVICE=cpu
   WHISPER_COMPUTE_TYPE=int8
   MAX_VIDEO_DURATION=900
   REQUEST_TIMEOUT=600
   TEMP_DIR=/tmp/whisper-service
   ENV=production
   ```

5. **Deploy**
   - Railway auto-deploys
   - Get your URL: `https://your-service.up.railway.app`

## Troubleshooting

### Build Fails - "ffmpeg not found"
- **On Render Free Tier**: This is expected - ffmpeg can't be installed
- **Solution**: Use Railway or upgrade Render plan

### Module Import Errors
- Check `requirements.txt` has all dependencies
- Verify Root Directory is set to `whisper-service`

### Service Won't Start
- Check logs in Render dashboard
- Verify `PORT` environment variable (Render sets this automatically)
- Check if Whisper model downloaded successfully

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Root Directory set to `whisper-service`
- [ ] Environment set to **"Python 3"** (NOT Docker)
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- [ ] All environment variables added
- [ ] Service URL copied for backend

## Recommendation

**For best results without Docker:**
- Use **Railway** instead of Render (supports ffmpeg installation)
- Or use **VPS** for full control
- Or use **Docker on Render** (simplest, most reliable)

The Docker deployment is recommended because it handles all dependencies automatically.

