# Notebook AI Study Assistant - React Native App

A React Native mobile application for the Notebook AI Study Assistant, connecting to the same backend API.

## Features

- 🔐 Authentication (Sign in/Sign up)
- 📚 Student Dashboard with stats
- 📄 PDF Upload and management
- 🎥 Video summaries
- 🤖 AI Tutor chat
- 📝 Study session history
- ⚙️ Settings

## Setup

### Prerequisites

- Node.js 18+ installed
- Expo CLI installed: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
cd app
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and set EXPO_PUBLIC_BACKEND_URL
```

3. Start the development server:
```bash
npm start
```

4. Run on your device/emulator:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Project Structure

```
app/
├── src/
│   ├── api/
│   │   └── axios.ts          # Centralized API client
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── navigation/
│   │   └── AppNavigator.tsx  # Navigation setup
│   └── screens/
│       ├── auth/
│       │   ├── SigninScreen.tsx
│       │   └── SignupScreen.tsx
│       └── main/
│           ├── StudentDashboardScreen.tsx
│           ├── UploadScreen.tsx
│           ├── AiTutorScreen.tsx
│           ├── VideoSummariesScreen.tsx
│           ├── ConsultationHistoryScreen.tsx
│           └── SettingsScreen.tsx
├── App.tsx                   # Root component
├── package.json
└── app.json                  # Expo configuration
```

## Backend Integration

The app connects to the same backend as the web app:
- Backend URL: `https://study-ai-kgxs.onrender.com`
- All API routes from `backend/src/routes/` are available
- Uses the same authentication system (JWT cookies)

## API Routes Used

- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/auth/me` - Get current user
- `/api/auth/logout` - User logout
- `/api/upload/documents` - Get/upload documents
- `/api/video` - Get videos
- `/api/chat/session` - Create chat session
- `/api/chat/messages` - Send/receive messages

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## Notes

- Uses Expo SecureStore for token storage
- All API calls use the centralized axios instance
- Navigation uses React Navigation
- UI follows the same design patterns as the web app



