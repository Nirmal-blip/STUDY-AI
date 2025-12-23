# Notebook AI Study Assistant - Web Frontend

A modern, responsive web application built with React, TypeScript, and Tailwind CSS for an AI-powered study assistant platform. This frontend connects to the Express.js backend API to provide features like PDF uploads, YouTube video transcription, AI tutoring, and study session management.

## 🚀 Features

- **🔐 Authentication**: Secure sign up and sign in with JWT-based authentication
- **📄 PDF Management**: Upload, view, and manage PDF documents
- **🎥 Video Summaries**: Add YouTube videos and get AI-generated summaries
- **🤖 AI Tutor Chat**: Interactive Q&A sessions with AI based on your uploaded content
- **📚 Study Sessions**: Organize documents and videos into study sessions
- **📊 Student Dashboard**: Overview of your documents, videos, and study progress
- **⚙️ Settings**: Manage your profile and preferences
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Framework**: React 19.0.0
- **Language**: TypeScript 5.7.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 4.0.15
- **Routing**: React Router DOM 7.4.0
- **HTTP Client**: Axios 1.8.4
- **UI Components**: 
  - React Icons 5.5.0
  - Framer Motion 12.23.26 (animations)
  - React Toastify 11.0.5 (notifications)
- **Maps**: React Leaflet 5.0.0 (for location features)
- **Markdown**: React Markdown 10.1.0 (for rendering AI responses)
- **Real-time**: Socket.io Client 4.8.1

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **Backend API**: Running backend service (see `../backend/README.md`)

## 🏗️ Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
   
   For production:
   ```env
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── admin.jpg
│   ├── girl.png
│   ├── LandingImg.jpg
│   └── ...
├── src/
│   ├── api/
│   │   └── axios.ts        # Centralized API client configuration
│   ├── assets/             # Images and static assets
│   │   ├── AuthImg.png
│   │   ├── girl.png
│   │   └── ...
│   ├── Components/         # Reusable React components
│   │   ├── About.tsx
│   │   ├── Chatbot.tsx
│   │   ├── ConfirmationModal.tsx
│   │   ├── ConsultationService.tsx
│   │   ├── Contact.tsx
│   │   ├── CTA.tsx
│   │   ├── Experts.tsx
│   │   ├── FAQ.tsx
│   │   ├── Footer.tsx
│   │   ├── Home.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Sidebar.tsx
│   │   └── Testimonials.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context provider
│   ├── Pages/              # Page components
│   │   ├── LandingPage.tsx
│   │   ├── SigninPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── Patient/
│   │       ├── AiTutor.tsx
│   │       ├── ConsultationHistory.tsx
│   │       ├── Settings.tsx
│   │       ├── StudentDashboard.tsx
│   │       ├── SummaryModal.tsx
│   │       ├── Upload.tsx
│   │       └── VideoSummaries.tsx
│   ├── stylesheets/        # Global styles
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # Application entry point
├── index.html              # HTML template
├── package.json
├── tsconfig.json           # TypeScript configuration
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🎯 Available Scripts

- **`npm run dev`**: Start development server with hot reload
- **`npm run build`**: Build production bundle
- **`npm run preview`**: Preview production build locally
- **`npm run lint`**: Run ESLint to check code quality

## 🔌 Backend Integration

The frontend connects to the backend API using the `VITE_BACKEND_URL` environment variable. All API calls are made through the centralized Axios client in `src/api/axios.ts`.

### API Endpoints Used

- **Authentication**:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `GET /api/auth/me` - Get current user
  - `PUT /api/auth/profile` - Update user profile

- **Documents**:
  - `POST /api/upload/pdf` - Upload PDF document
  - `GET /api/upload/documents` - Get all documents
  - `DELETE /api/upload/documents/:id` - Delete document
  - `GET /api/upload/documents/:id/summary` - Get document summary
  - `GET /api/upload/documents/:id/status` - Check processing status

- **Videos**:
  - `POST /api/video/add` - Add YouTube video
  - `GET /api/video` - Get all videos
  - `DELETE /api/video/:id` - Delete video
  - `GET /api/video/:id/summary` - Get video summary
  - `GET /api/video/:id/status` - Check transcription status

- **Chat**:
  - `POST /api/chat/session` - Create chat session
  - `POST /api/chat/messages` - Send message
  - `GET /api/chat/messages` - Get chat history

- **Study Sessions**:
  - `GET /api/study/sessions` - Get all study sessions
  - `POST /api/study/sessions` - Create study session

## 🔒 Authentication

The app uses JWT-based authentication with HTTP-only cookies. The authentication state is managed through `AuthContext` which provides:

- User login/logout functionality
- Protected routes
- Automatic token refresh
- Session persistence

## 🎨 Styling

The application uses **Tailwind CSS** for styling with a modern, responsive design:

- Mobile-first approach
- Dark/light mode support (if configured)
- Smooth animations with Framer Motion
- Consistent color scheme and typography

## 📱 Responsive Design

The frontend is fully responsive and works on:
- **Desktop**: Full feature set with sidebar navigation
- **Tablet**: Optimized layout with collapsible navigation
- **Mobile**: Touch-friendly interface with bottom navigation

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `VITE_BACKEND_URL`: Your backend API URL

### Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Environment variables**: Set `VITE_BACKEND_URL`

### Render

1. Create a new **Static Site** service
2. **Build command**: `npm run build`
3. **Publish directory**: `dist`
4. Set environment variable: `VITE_BACKEND_URL`

### Manual Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy `dist` folder** to any static hosting service:
   - AWS S3 + CloudFront
   - GitHub Pages
   - Any web server (nginx, Apache)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_BACKEND_URL` | Backend API URL | - | Yes |

### Vite Configuration

The Vite config (`vite.config.js`) includes:
- React plugin
- Tailwind CSS plugin
- Path aliases (`@` → `/src`)

## 🐛 Troubleshooting

### CORS Errors

If you encounter CORS errors:
1. Ensure `VITE_BACKEND_URL` matches your backend's `FRONTEND_URL`
2. Check backend CORS configuration
3. Verify credentials are being sent (`withCredentials: true`)

### API Connection Issues

1. Verify `VITE_BACKEND_URL` is set correctly
2. Check backend is running and accessible
3. Check browser console for detailed error messages
4. Verify network connectivity

### Build Errors

1. Clear `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check Node.js version (requires v18+)

3. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

## 📝 Development Tips

1. **Hot Reload**: Vite provides instant hot module replacement
2. **TypeScript**: Use TypeScript for type safety
3. **Component Structure**: Keep components small and focused
4. **API Calls**: Always use the centralized `apiClient` from `src/api/axios.ts`
5. **Error Handling**: Use try-catch blocks and show user-friendly error messages

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 🔗 Related Documentation

- [Backend README](../backend/README.md)
- [Mobile App README](../app/README.md)
- [Whisper Service README](../whisper-service/README.md)

## 💡 Features in Detail

### PDF Upload & Processing
- Drag-and-drop file upload
- Real-time processing status
- Automatic text extraction
- AI-generated summaries

### YouTube Video Integration
- Add videos by URL
- Automatic transcription via Whisper service
- Video summaries with key points
- Thumbnail and metadata display

### AI Tutor Chat
- Context-aware responses based on uploaded content
- Real-time chat interface
- Chat history persistence
- Markdown rendering for formatted responses

### Study Sessions
- Organize content into sessions
- Track study progress
- Session-based chat context
- Document and video grouping

---

**Built with ❤️ for students and learners**

