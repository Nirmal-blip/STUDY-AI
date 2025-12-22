# Deployment Guide

## Render Backend Deployment

### Environment Variables to Set on Render

Go to your Render dashboard → Your Service → Environment → Add Environment Variable

#### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notebook_db
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
```

#### Recommended Variables:
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-domain.vercel.app
FRONTEND_URLS=http://localhost:5173,https://your-frontend-domain.vercel.app
```

#### Optional Variables:
```
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
GEMINI_API_KEY=your-gemini-api-key
```

### CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5173` (local development)
- `http://localhost:3000` (alternative local port)
- `http://localhost:5174` (Vite alternative port)
- Any URL set in `FRONTEND_URL` environment variable
- Multiple URLs set in `FRONTEND_URLS` (comma-separated)

### Testing Local Frontend with Production Backend

If you want to test your local frontend (`http://localhost:5173`) with your production backend on Render:

1. **Option 1: Set FRONTEND_URLS on Render**
   ```
   FRONTEND_URLS=http://localhost:5173,https://your-production-frontend.vercel.app
   ```

2. **Option 2: The localhost origins are already hardcoded**
   - The backend already allows `http://localhost:5173` by default
   - Just make sure your frontend `.env` has:
     ```
     VITE_BACKEND_URL=https://study-ai-kgxs.onrender.com
     ```

### Troubleshooting CORS Issues

1. **Check backend logs on Render** - Look for "CORS blocked origin" warnings
2. **Verify environment variables** - Make sure `FRONTEND_URL` or `FRONTEND_URLS` includes your frontend URL
3. **Check browser console** - Look for the exact origin being blocked
4. **Restart Render service** - After changing environment variables, restart the service

### Common CORS Errors

**Error: "No 'Access-Control-Allow-Origin' header"**
- Solution: Add your frontend URL to `FRONTEND_URLS` on Render
- Or ensure `http://localhost:5173` is in the allowed origins (already included)

**Error: "Credentials flag is true, but Access-Control-Allow-Credentials is not 'true'"**
- Solution: Already configured with `credentials: true` in CORS settings

**Error: "Preflight request doesn't pass"**
- Solution: OPTIONS method is already allowed in CORS configuration

## Vercel Frontend Deployment

### Environment Variables to Set on Vercel

Go to your Vercel project → Settings → Environment Variables

#### Required:
```
VITE_BACKEND_URL=https://study-ai-kgxs.onrender.com
```

### Build Settings

Vercel will auto-detect Vite, but you can verify:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Testing Checklist

- [ ] Backend deployed on Render and accessible
- [ ] Frontend can connect to backend API
- [ ] CORS errors resolved
- [ ] Authentication working (login/register)
- [ ] File uploads working
- [ ] Video processing working
- [ ] Chat/AI tutor working

## Support

If you encounter CORS issues:
1. Check the backend logs on Render for blocked origins
2. Verify all environment variables are set correctly
3. Ensure both services are restarted after env changes
4. Check browser console for specific error messages


## Setting Environment Variables in Vercel

### For Frontend (Vite)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Key:** `VITE_BACKEND_URL`
   - **Value:** `https://study-ai-kgxs.onrender.com` (or your backend URL)
   - **Environment:** Select all (Production, Preview, Development)

4. **Important:** After adding environment variables, you need to:
   - Redeploy your application, OR
   - Go to **Deployments** → Click the three dots on latest deployment → **Redeploy**

### Why not in vercel.json?

- Vite environment variables (prefixed with `VITE_`) are build-time variables
- They need to be set in Vercel's Environment Variables section
- The `vercel.json` file is for routing, headers, and build configuration only
- Environment variables in `vercel.json` use Vercel secrets syntax (`@secret_name`), which is for serverless functions, not build-time variables



