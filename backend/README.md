# Notebook Backend - Interactive Study Tool

Backend API for an interactive study tool inspired by NotebookLM, built with Express.js and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with cookie support
- **PDF Processing**: Upload and extract text from PDF documents
- **YouTube Integration**: Fetch transcripts and generate summaries from YouTube videos
- **AI-Powered Chat**: Interactive Q&A using OpenAI GPT models
- **Study Sessions**: Organize documents and videos into study sessions
- **Audio Dialogue**: Generate teacher-student conversation dialogues
- **Video Summaries**: AI-generated summaries with key points

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI/LLM**: OpenAI API (GPT-3.5-turbo)
- **File Upload**: Multer
- **Logging**: Winston

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key
- npm or yarn

## Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/notebook_db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   OPENAI_API_KEY=your-openai-api-key-here
   FRONTEND_URL=http://localhost:5173
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   PYTHON_AI_SERVICE_URL=http://localhost:8000
   ```

4. **Create upload directories**
   ```bash
   mkdir -p uploads/pdf uploads/audio uploads/images
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/logout` - Logout user

### Document Upload
- `POST /api/upload/pdf` - Upload PDF file
- `POST /api/upload/note` - Create text note
- `GET /api/upload/documents` - Get all documents
- `GET /api/upload/documents/:id` - Get document by ID
- `DELETE /api/upload/documents/:id` - Delete document

### Study Sessions
- `POST /api/study/sessions` - Create study session
- `GET /api/study/sessions` - Get all sessions
- `GET /api/study/sessions/:id` - Get session by ID
- `PUT /api/study/sessions/:id` - Update session
- `DELETE /api/study/sessions/:id` - Delete session
- `POST /api/study/sessions/:id/summary` - Generate session summary

### Chat
- `POST /api/chat/messages` - Send chat message
- `GET /api/chat/messages/:sessionId` - Get chat messages
- `POST /api/chat/audio-dialogue` - Generate audio dialogue
- `GET /api/chat/audio-dialogue/:sessionId` - Get audio dialogues

### Videos
- `POST /api/video/add` - Add YouTube video
- `GET /api/video` - Get all videos
- `GET /api/video/:id` - Get video by ID
- `PUT /api/video/:id` - Update video
- `DELETE /api/video/:id` - Delete video
- `POST /api/video/:id/summary` - Generate video summary

### Health Check
- `GET /api/health` - Server health check

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── db.js        # MongoDB connection
│   │   ├── env.js       # Environment config
│   │   └── openai.js    # OpenAI client
│   ├── models/          # Mongoose models
│   │   ├── User.model.js
│   │   ├── Document.model.js
│   │   ├── Video.model.js
│   │   ├── StudySession.model.js
│   │   └── ChatMessage.model.js
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   ├── upload.routes.js
│   │   ├── study.routes.js
│   │   ├── chat.routes.js
│   │   └── video.routes.js
│   ├── controllers/     # Route controllers
│   │   ├── auth.controller.js
│   │   ├── upload.controller.js
│   │   ├── study.controller.js
│   │   ├── chat.controller.js
│   │   └── video.controller.js
│   ├── services/        # Business logic services
│   │   ├── pdf.service.js
│   │   ├── youtube.service.js
│   │   ├── llm.service.js
│   │   ├── audio.service.js
│   │   └── embedding.service.js
│   ├── middlewares/     # Express middlewares
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── utils/           # Utility functions
│   │   ├── logger.js
│   │   └── helpers.js
│   └── app.js           # Express app configuration
├── uploads/             # Uploaded files
│   ├── pdf/
│   ├── audio/
│   └── images/
├── logs/                # Application logs
├── server.js            # Server entry point
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## Authentication

The API uses JWT tokens stored in HTTP-only cookies for security. The frontend automatically includes cookies in requests.

### Request Format
- Include cookies automatically (browser handles this)
- Or use Authorization header: `Authorization: Bearer <token>`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRE` | JWT token expiration | `7d` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `MAX_FILE_SIZE` | Max upload file size (bytes) | `10485760` (10MB) |
| `UPLOAD_PATH` | Upload directory path | `./uploads` |
| `PYTHON_AI_SERVICE_URL` | Python AI service URL (optional) | `http://localhost:8000` |

## Integration with Frontend

The backend is configured to work with the React frontend:

1. **CORS**: Configured to allow requests from `FRONTEND_URL`
2. **Cookies**: HTTP-only cookies for authentication
3. **API Endpoints**: Match frontend expectations

### Frontend Environment Variable
Make sure your frontend `.env` has:
```env
VITE_BACKEND_URL=http://localhost:5000
```

## Python AI Service Integration

For advanced AI features (TTS, etc.), you can integrate a Python service:

1. Set `PYTHON_AI_SERVICE_URL` in `.env`
2. The Python service should expose endpoints like:
   - `POST /api/tts` - Text-to-speech
   - `POST /api/chat/stream` - Streaming chat responses

## Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Logging

Logs are written to:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

## Development Tips

1. **Hot Reload**: Use `npm run dev` for automatic server restart
2. **Database**: Use MongoDB Compass or Studio 3T for database management
3. **Testing**: Use Postman or Insomnia to test API endpoints
4. **Debugging**: Check `logs/` directory for detailed logs

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### OpenAI API Error
- Verify `OPENAI_API_KEY` is set correctly
- Check API quota/limits
- Ensure sufficient credits

### File Upload Error
- Check `uploads/` directory permissions
- Verify `MAX_FILE_SIZE` is sufficient
- Ensure disk space available

### CORS Error
- Verify `FRONTEND_URL` matches your frontend URL
- Check browser console for specific CORS errors

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a secure `JWT_SECRET`
3. Configure proper CORS origins
4. Set up MongoDB Atlas or managed MongoDB
5. Use environment variables for sensitive data
6. Enable HTTPS
7. Set up proper logging and monitoring

## License

ISC

## Support

For issues or questions, please contact the development team.


