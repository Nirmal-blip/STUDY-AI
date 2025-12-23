# Deploy Whisper Service on Render WITH Docker

## Prerequisites

- GitHub account
- Render account (sign up at [render.com](https://render.com) - free tier available)
- Your code pushed to GitHub

## Step-by-Step Deployment (WITH Docker)

### Step 1: Push Code to GitHub

1. **Commit and push your whisper-service code:**
   ```bash
   cd /Users/shubhamjoshi/Desktop/notebook
   git add whisper-service/
   git commit -m "Add Whisper transcription service with Docker"
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

### Step 3: Configure the Service (WITH DOCKER)

Fill in the service configuration:

1. **Basic Settings:**
   - **Name**: `whisper-service` (or any name you prefer)
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `whisper-service` ⚠️ **IMPORTANT**

2. **Build & Deploy Settings:**
   - **Environment**: Select **"Docker"** ⚠️ **CRITICAL**
   - **Docker Build Context Directory**: `whisper-service` ⚠️ **IMPORTANT**
     - This tells Docker where to look for files (relative to repo root)
   - **Dockerfile Path**: `Dockerfile` 
     - This is relative to the build context directory
     - Since build context is `whisper-service`, Dockerfile path is just `Dockerfile`
   - **Build Command**: (leave empty - Docker handles it)
   - **Start Command**: (leave empty - Docker handles it)

### Step 4: Set Environment Variables

Click on **"Environment"** tab and add these variables:

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

**Note**: `PORT` is set but Render will override it with `$PORT` automatically.

### Step 5: Deploy

1. **Review Settings**
   - Double-check Root Directory is `whisper-service`
   - Verify Environment is set to **"Docker"** (NOT Python 3)
   - Verify Docker Build Context Directory is `whisper-service`
   - Confirm all environment variables are added

2. **Create Service**
   - Click **"Create Web Service"** at the bottom
   - Render will start building your Docker image

3. **Monitor Build**
   - Watch the build logs in real-time
   - First build takes 5-10 minutes:
     - Docker image builds (2-3 minutes)
     - Python dependencies install
     - Whisper model downloads (first time only, 2-3 minutes)

### Step 6: Wait for Deployment

1. **Build Process:**
   - Docker image builds
   - System packages install (ffmpeg, curl, etc.)
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

2. **Test Transcription** (optional):
   ```bash
   curl -X POST https://your-service-name.onrender.com/transcribe-youtube \
     -H "Content-Type: application/json" \
     -d '{"youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
   ```

### Step 8: Update Node.js Backend

1. **Get Your Service URL:**
   - Copy the URL from Render dashboard (e.g., `https://whisper-service.onrender.com`)

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

## Important Notes

### Docker Advantages

✅ **Automatic ffmpeg installation** - No need to worry about system packages  
✅ **Consistent environment** - Same setup everywhere  
✅ **No Rust compilation issues** - Python 3.11 in Docker image  
✅ **Easier deployment** - Just push code, Docker handles the rest  

### Free Tier Limitations

- **Spins down after 15 minutes** of inactivity
- **First request after spin-down** takes 30-60 seconds (cold start)
- **750 hours/month** total runtime
- For production, consider **Starter plan ($7/month)** for always-on service

### Service URL

- Your service URL will be: `https://your-service-name.onrender.com`
- No trailing slash needed
- HTTPS is automatic

## Troubleshooting

### Build Fails

**Error: "Dockerfile not found"**
- Verify Root Directory is `whisper-service`
- Verify Docker Build Context Directory is `whisper-service`
- Check Dockerfile exists in `whisper-service/` directory

**Error: "pkg-config is required"**
- ✅ Fixed: Dockerfile includes `pkg-config` and `build-essential`
- Should not occur with current Dockerfile

**Error: "ffmpeg not found"**
- ✅ Fixed: Dockerfile installs ffmpeg via apt-get
- Verify Dockerfile has `ffmpeg` in apt-get install

**Error: "Module not found"**
- Check `requirements.txt` has all dependencies
- Verify Root Directory is set to `whisper-service`

### Service Won't Start

**Check Logs:**
- Go to "Logs" tab in Render dashboard
- Look for error messages
- Common issues:
  - Missing environment variables
  - Port conflict (should use `$PORT` or `8000`)
  - Model download failed

**Health Check Fails:**
- Service might still be starting (first startup takes 1-2 minutes)
- Check logs for model loading progress
- Wait 2-3 minutes and try again

### Connection Issues from Backend

**"Connection refused" or timeout:**
- Verify service URL is correct (no trailing slash)
- Check service is running (green status in Render)
- For free tier: First request after spin-down takes time
- Check CORS settings (should allow all origins by default)

**Test connection:**
```bash
curl https://your-service-name.onrender.com/health
```

## Quick Checklist

Before deploying, verify:

- [ ] Code is pushed to GitHub
- [ ] `whisper-service/` folder exists in repository
- [ ] `Dockerfile` exists in `whisper-service/`
- [ ] `requirements.txt` exists (without ffmpeg-python)
- [ ] `app.py` exists
- [ ] Root Directory set to `whisper-service`
- [ ] Environment set to **"Docker"** ⚠️ **CRITICAL**
- [ ] Docker Build Context Directory set to `whisper-service`
- [ ] Dockerfile Path set to `Dockerfile`
- [ ] All environment variables added
- [ ] Service URL copied for backend configuration

## After Deployment

1. ✅ Service is live at `https://your-service-name.onrender.com`
2. ✅ Health check returns `{"status": "healthy"}`
3. ✅ Backend `PYTHON_AI_SERVICE_URL` is updated
4. ✅ Test YouTube transcription from your app

## Next Steps

1. **Monitor Performance**: Check logs and metrics
2. **Set Up Alerts**: Configure notifications for service issues
3. **Scale if Needed**: Upgrade plan if you need more resources
4. **Backup**: Consider setting up automated backups

---

**Why Docker is Recommended:**
- ✅ Handles all system dependencies automatically
- ✅ No Rust compilation issues (Python 3.11 in image)
- ✅ ffmpeg pre-installed
- ✅ Consistent environment across deployments
- ✅ Easier to maintain and update

