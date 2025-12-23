# Backend Deployment Guide

## Quick Deployment

### Render (Recommended)

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repository
   - Root Directory: `backend`

2. **Build & Start Commands**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   Set all variables from `.env.example`:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   FRONTEND_URL=https://your-frontend-domain.com
   PYTHON_AI_SERVICE_URL=https://study-ai-1-nigc.onrender.com
   OPENAI_API_KEY=your-openai-key
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment

### Railway

1. **New Project → Deploy from GitHub**
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**: Same as Render

### VPS

1. **SSH into server**
2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo/backend
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Setup environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

6. **Create systemd service**
   ```bash
   sudo nano /etc/systemd/system/notebook-backend.service
   ```
   
   ```ini
   [Unit]
   Description=Notebook Backend Service
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/path/to/backend
   Environment="NODE_ENV=production"
   ExecStart=/usr/bin/node server.js
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

7. **Enable and start**
   ```bash
   sudo systemctl enable notebook-backend
   sudo systemctl start notebook-backend
   ```

## Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment | No (default: development) |
| `MONGODB_URI` | MongoDB connection | **Yes** |
| `JWT_SECRET` | JWT secret key | **Yes** |
| `FRONTEND_URL` | Frontend URL for CORS | **Yes** (production) |
| `PYTHON_AI_SERVICE_URL` | Whisper service URL | **Yes** (for YouTube) |
| `OPENAI_API_KEY` | OpenAI API key | **Yes** (for AI features) |

## Post-Deployment Checklist

- [ ] MongoDB connection working
- [ ] Environment variables set
- [ ] Whisper service URL configured
- [ ] Frontend URL configured for CORS
- [ ] Test API endpoints
- [ ] Test YouTube transcription
- [ ] Check logs for errors
- [ ] Setup monitoring/logging

## Testing After Deployment

```bash
# Health check
curl https://your-backend-url/api/health

# Test authentication
curl -X POST https://your-backend-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Common Issues

### Port Already in Use
- Change `PORT` in environment variables
- Or kill process using the port

### MongoDB Connection Failed
- Verify `MONGODB_URI` is correct
- Check MongoDB network access (firewall, IP whitelist)
- For MongoDB Atlas, ensure IP is whitelisted

### Whisper Service Connection Failed
- Verify `PYTHON_AI_SERVICE_URL` is correct
- Test: `curl $PYTHON_AI_SERVICE_URL/health`
- Check CORS configuration

### CORS Errors
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Check backend CORS configuration in `src/app.js`

