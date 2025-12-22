# Environment Variables Setup Guide

This guide will help you set up environment variables for both frontend and backend.

## Quick Start

1. **Backend Setup:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your actual values
   ```

## Backend Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/notebook_db` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `your-super-secret-key-here` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PORT` | Server port | `3000` | `3000` |
| `NODE_ENV` | Environment mode | `development` | `development` or `production` |
| `JWT_EXPIRE` | JWT token expiration | `7d` | `7d`, `24h`, `1h` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` | `http://localhost:5173` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `10485760` (10MB) | `10485760` |
| `UPLOAD_PATH` | Upload directory | `./uploads` | `./uploads` |
| `GEMINI_API_KEY` | Google Gemini API key | - | `your-gemini-api-key` |
| `PYTHON_AI_SERVICE_URL` | Python AI service URL | `http://localhost:8000` | `http://localhost:8000` |

### MongoDB Connection Strings

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/notebook_db
```

**MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notebook_db?retryWrites=true&w=majority
```

### Generating JWT Secret

You can generate a secure JWT secret using:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Frontend Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:3000` |

### Development vs Production

**Development:**
```env
VITE_BACKEND_URL=http://localhost:3000
```

**Production:**
```env
VITE_BACKEND_URL=https://api.yourdomain.com
```

## Security Best Practices

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **Use strong JWT secrets** - At least 32 characters, random
3. **Use different secrets for production** - Never use development secrets in production
4. **Keep API keys secure** - Don't share them publicly
5. **Use environment-specific files** - `.env.development`, `.env.production`

## Troubleshooting

### Backend can't connect to MongoDB
- Check `MONGODB_URI` is correct
- Ensure MongoDB is running (if local)
- Check network/firewall settings (if remote)

### Frontend can't connect to backend
- Verify `VITE_BACKEND_URL` matches backend `PORT`
- Check CORS settings in backend `FRONTEND_URL`
- Ensure backend server is running

### JWT authentication fails
- Verify `JWT_SECRET` is set and matches
- Check token expiration settings
- Ensure cookies are enabled in browser

## Example .env Files

### Backend `.env`
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/notebook_db
JWT_SECRET=your-actual-secret-key-min-32-chars-long
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
GEMINI_API_KEY=your-gemini-api-key-here
```

### Frontend `.env`
```env
VITE_BACKEND_URL=http://localhost:3000
```

## Notes

- All `.env` files are gitignored and will not be committed
- `.env.example` files are committed as templates
- Restart your servers after changing environment variables
- In production, set environment variables through your hosting platform (Vercel, Heroku, etc.)



