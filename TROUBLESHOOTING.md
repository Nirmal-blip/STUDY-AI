# Troubleshooting Guide

## Common Issues and Solutions

### 1. Backend Not Connecting

**Check if backend is running:**
```bash
curl http://localhost:3000/api/health
```
Should return: `{"status":"OK","message":"Server is running",...}`

**Check backend logs:**
```bash
cd backend
tail -f logs/combined.log
```

### 2. CORS Errors

**Symptoms:** Browser console shows CORS errors

**Solution:** 
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check backend `src/app.js` has CORS configured:
  ```javascript
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));
  ```

### 3. Authentication Not Working

**Check cookies:**
- Open browser DevTools → Application → Cookies
- Look for `token` cookie from `localhost:3000`
- Should be HTTP-only

**Check network requests:**
- Open DevTools → Network tab
- Look for `/api/auth/login` or `/api/auth/register`
- Check if `withCredentials: true` is in request headers
- Check response status (200 = success, 401 = unauthorized)

### 4. MongoDB Connection Issues

**Check MongoDB connection:**
```bash
# Check backend logs
cd backend
tail -20 logs/combined.log | grep -i mongo
```

**Common issues:**
- MongoDB URI incorrect in `.env`
- MongoDB not running (if local)
- Network firewall blocking MongoDB Atlas

### 5. Frontend Environment Variables

**Verify frontend `.env`:**
```bash
cd frontend
cat .env
```

Should have:
```
VITE_BACKEND_URL=http://localhost:3000
```

**Important:** After changing `.env`, restart the frontend dev server!

### 6. API Endpoint Mismatches

**Test endpoints manually:**
```bash
# Health check
curl http://localhost:3000/api/health

# Register (test)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","userType":"student"}'

# Login (test)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","userType":"student"}'
```

### 7. Browser Console Errors

**Check for:**
- Network errors (404, 500, CORS)
- JavaScript errors
- Console warnings

**Common errors:**
- `Failed to fetch` → Backend not running or wrong URL
- `401 Unauthorized` → Invalid credentials or missing token
- `CORS policy` → CORS configuration issue

### 8. Cookie Issues

**If cookies not being set:**
- Check browser settings (cookies enabled?)
- Check if using HTTPS in production (cookies need secure flag)
- Verify `sameSite: 'lax'` in backend cookie settings

### 9. Port Conflicts

**Check if port is in use:**
```bash
# Check port 3000
lsof -ti:3000

# Check port 5173
lsof -ti:5173
```

**Kill process if needed:**
```bash
kill -9 <PID>
```

### 10. Environment Variable Not Loading

**Vite requires restart:**
- After changing `.env`, restart frontend dev server
- Variables must start with `VITE_` to be accessible

**Check if loaded:**
```javascript
console.log((import.meta as any).env.VITE_BACKEND_URL);
```

## Quick Diagnostic Checklist

- [ ] Backend running on port 3000?
- [ ] Frontend running on port 5173?
- [ ] MongoDB connected? (check backend logs)
- [ ] Frontend `.env` has `VITE_BACKEND_URL=http://localhost:3000`?
- [ ] Backend `.env` has `FRONTEND_URL=http://localhost:5173`?
- [ ] Browser console shows no CORS errors?
- [ ] Network tab shows successful API calls?
- [ ] Cookies are being set in browser?
- [ ] No syntax errors in browser console?

## Testing the Connection

1. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open browser:**
   - Go to `http://localhost:5173`
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for API calls

4. **Test registration:**
   - Go to signup page
   - Fill form and submit
   - Check Network tab for `/api/auth/register`
   - Should see 201 status and response with token

5. **Test login:**
   - Go to signin page
   - Fill form and submit
   - Check Network tab for `/api/auth/login`
   - Should see 200 status and response with token

## Still Not Working?

1. **Check backend logs:**
   ```bash
   cd backend
   tail -50 logs/combined.log
   ```

2. **Check browser console:**
   - Open DevTools → Console
   - Look for red errors

3. **Check network requests:**
   - Open DevTools → Network
   - Filter by "XHR" or "Fetch"
   - Click on failed requests
   - Check "Response" and "Headers" tabs

4. **Verify environment:**
   ```bash
   # Backend
   cd backend && cat .env | grep -E "PORT|FRONTEND_URL|MONGODB"
   
   # Frontend
   cd frontend && cat .env
   ```


