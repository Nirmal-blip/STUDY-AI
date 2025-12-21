# Render Backend Troubleshooting Guide

## 502 Bad Gateway Error

A 502 error means the backend service on Render is either:
1. **Not running** - Service crashed or failed to start
2. **Taking too long** - Request timeout
3. **Configuration issue** - Missing environment variables or wrong settings

## Quick Fixes

### 1. Check Render Logs

Go to your Render dashboard → Your Service → **Logs**

Look for:
- ❌ `Error: Cannot find module...` → Missing dependency
- ❌ `MongoServerError` → Database connection issue
- ❌ `EADDRINUSE` → Port conflict
- ❌ `JWT_SECRET is not set` → Missing environment variable

### 2. Verify Environment Variables

**Required:**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-min-32-chars
```

**Recommended:**
```
NODE_ENV=production
PORT=10000
FRONTEND_URLS=http://localhost:5173,https://your-frontend.vercel.app
```

### 3. Check Build & Start Commands

In Render dashboard → Settings → Build & Deploy:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
node server.js
```

**OR if using npm scripts:**
```bash
npm start
```

### 4. Verify package.json Scripts

Your `package.json` should have:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

### 5. Check Server Port

Render provides the port via `process.env.PORT`. Your `server.js` should use:
```javascript
const PORT = process.env.PORT || 3000;
```

### 6. Database Connection

If MongoDB connection fails, the server might crash. Check:
- MongoDB URI is correct
- IP whitelist includes Render's IPs (or 0.0.0.0/0 for all)
- Database credentials are correct

### 7. Restart Service

After fixing issues:
1. Go to Render dashboard
2. Click **Manual Deploy** → **Clear build cache & deploy**
3. Wait for deployment to complete
4. Check logs for errors

## CORS Issues

### Symptoms:
- `Access to XMLHttpRequest... has been blocked by CORS policy`
- `No 'Access-Control-Allow-Origin' header`

### Fix:
1. Set `FRONTEND_URLS` on Render:
   ```
   FRONTEND_URLS=http://localhost:5173,https://your-frontend.vercel.app
   ```

2. The backend already allows `http://localhost:5173` by default

3. Restart the service after changing environment variables

## Cookie Issues

### Symptoms:
- 401 Unauthorized even after login
- Cookies not being set

### Fix:
- Cookies are now environment-aware:
  - **Production (HTTPS):** `secure: true, sameSite: 'none'`
  - **Development (HTTP):** `secure: false, sameSite: 'lax'`

- Ensure `NODE_ENV=production` is set on Render

## Common Errors & Solutions

### Error: "Cannot find module 'express'"
**Solution:** Add `npm install` to build command

### Error: "MongoServerError: Authentication failed"
**Solution:** Check MongoDB URI credentials

### Error: "JWT_SECRET is not set"
**Solution:** Add `JWT_SECRET` environment variable

### Error: "Port 3000 already in use"
**Solution:** Use `process.env.PORT` (Render provides this automatically)

### Error: "ECONNREFUSED" (Database)
**Solution:** 
- Check MongoDB URI
- Verify IP whitelist
- Check network connectivity

## Testing Locally

Before deploying to Render, test locally:

1. **Set environment variables:**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI=your-mongodb-uri
   export JWT_SECRET=your-secret
   export FRONTEND_URLS=http://localhost:5173
   ```

2. **Start server:**
   ```bash
   npm start
   ```

3. **Test from frontend:**
   - Update frontend `.env`: `VITE_BACKEND_URL=http://localhost:3000`
   - Try login/register
   - Check browser console for errors

## Health Check Endpoint

Test if backend is running:
```bash
curl https://study-ai-kgxs.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server running"
}
```

If this fails, the server is not running properly.

## Still Having Issues?

1. **Check Render Status Page:** https://status.render.com
2. **Review Render Documentation:** https://render.com/docs
3. **Check Service Limits:** Free tier has limitations
4. **Upgrade Plan:** If hitting rate limits or timeouts

