# Step-by-Step Deployment Guide

## Quick Deployment Options

### 🚂 Option 1: Railway (Recommended - Supports ffmpeg)

#### Prerequisites
- GitHub repository with your code
- Railway account (free tier available)

#### Steps

1. **Push code to GitHub**
   ```bash
   git add whisper-service/
   git commit -m "Add Whisper transcription service"
   git push origin main
   ```

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure Service**
   - **Root Directory**: `whisper-service`
   - **Build Command**: `pip install -r requirements.txt && apt-get update && apt-get install -y ffmpeg`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**
   Click "Variables" tab and add:
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
   - Railway auto-deploys on push
   - Get your service URL from Railway dashboard
   - Example: `https://whisper-service.up.railway.app`

6. **Update Node.js Backend**
   In your Node.js backend `.env` file:
   ```env
   PYTHON_AI_SERVICE_URL=https://your-service.up.railway.app
   ```

7. **Test**
   ```bash
   curl https://your-service.up.railway.app/health
   ```

---

### 🚀 Option 2: Render (Python 3 - Limited)

#### Steps

1. **Push code to GitHub** (same as Render)

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure Service**
   - **Root Directory**: `whisper-service`
   - **Build Command**: `pip install -r requirements.txt && apt-get update && apt-get install -y ffmpeg`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**
   Same as Render (see above)

5. **Deploy**
   - Railway auto-deploys on push
   - Get your service URL from Railway dashboard

6. **Update Node.js Backend**
   ```env
   PYTHON_AI_SERVICE_URL=https://your-service.up.railway.app
   ```

---

### 🖥️ Option 3: VPS (Full Control - Recommended for Production)

#### Steps

1. **SSH into your VPS**
   ```bash
   ssh user@your-vps-ip
   ```

2. **Install dependencies**
   ```bash
   sudo apt-get update
   sudo apt-get install -y python3-pip python3-venv ffmpeg git
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo/whisper-service
   ```

4. **Setup virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. **Create systemd service**
   ```bash
   sudo nano /etc/systemd/system/whisper-service.service
   ```
   
   Add this content:
   ```ini
   [Unit]
   Description=Whisper Transcription Service
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/path/to/your/repo/whisper-service
   Environment="PATH=/path/to/your/repo/whisper-service/venv/bin"
   Environment="PORT=8000"
   Environment="WHISPER_MODEL=small"
   Environment="WHISPER_DEVICE=cpu"
   Environment="WHISPER_COMPUTE_TYPE=int8"
   ExecStart=/path/to/your/repo/whisper-service/venv/bin/uvicorn app:app --host 0.0.0.0 --port 8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

6. **Enable and start service**
   ```bash
   sudo systemctl enable whisper-service
   sudo systemctl start whisper-service
   sudo systemctl status whisper-service
   ```

7. **Setup Nginx reverse proxy** (optional but recommended)
   ```bash
   sudo apt-get install -y nginx
   sudo nano /etc/nginx/sites-available/whisper-service
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
   
   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/whisper-service /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## After Deployment

### 1. Test the Service

```bash
# Health check
curl https://your-service-url/health

# Test transcription (this will take a minute)
curl -X POST https://your-service-url/transcribe-youtube \
  -H "Content-Type: application/json" \
  -d '{"youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

### 2. Update Node.js Backend

**If Node.js backend is on Render:**
1. Go to your Node.js backend service on Render
2. Click "Environment" tab
3. Add/Update: `PYTHON_AI_SERVICE_URL=https://your-whisper-service-url`
4. Save and redeploy

**If Node.js backend is local:**
1. Update `.env` file:
   ```env
   PYTHON_AI_SERVICE_URL=https://your-whisper-service-url
   ```
2. Restart your Node.js backend

### 3. Test End-to-End

1. Add a YouTube video from your frontend
2. Check backend logs for transcription progress
3. Verify video status changes to "ready" in database

---

## Troubleshooting

### Service won't start
- Check logs: `render logs` or Railway dashboard
- Verify environment variables are set
- Check if port is correct (should be 8000 or $PORT)

### Transcription fails
- Check service logs for errors
- Verify ffmpeg is installed (should be in Dockerfile)
- Check video URL is accessible
- Verify video duration is within limits

### Connection refused from Node.js
- Verify `PYTHON_AI_SERVICE_URL` is correct
- Check if service is running: `curl https://your-service/health`
- Verify CORS is configured (already set to allow all)

### Out of memory
- Use smaller model: `WHISPER_MODEL=tiny` or `base`
- Reduce compute type: `WHISPER_COMPUTE_TYPE=int8`
- Increase service memory allocation

---

## Cost Estimates

- **Render Free Tier**: 750 hours/month (enough for testing)
- **Render Paid**: $7/month for always-on service
- **Railway**: $5/month + usage
- **VPS**: $5-10/month (DigitalOcean, Linode, etc.)

---

## Next Steps

1. ✅ Deploy Whisper service
2. ✅ Update Node.js backend with service URL
3. ✅ Test transcription
4. ✅ Monitor logs and performance
5. ⚠️ Consider adding rate limiting for production
6. ⚠️ Consider adding authentication if needed

