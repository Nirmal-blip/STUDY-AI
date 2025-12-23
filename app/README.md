# Notebook AI Study Assistant - Mobile App

A React Native mobile application built with Expo for the Notebook AI Study Assistant platform. This mobile app provides the same powerful features as the web app, optimized for iOS and Android devices.

## 🚀 Features

- **🔐 Authentication**: Secure sign up and sign in
- **📊 Student Dashboard**: Overview of your study materials and progress
- **📄 PDF Upload**: Upload and manage PDF documents from your device
- **🎥 Video Summaries**: Add YouTube videos and get AI-generated summaries
- **🤖 AI Tutor Chat**: Interactive Q&A sessions with AI based on your content
- **📚 Study Session History**: View and manage your study sessions
- **⚙️ Settings**: Manage your profile and app preferences
- **📱 Native Experience**: Optimized for iOS and Android with native components

## 🛠️ Tech Stack

- **Framework**: React Native 0.74.5
- **Platform**: Expo ~51.0.0
- **Language**: TypeScript ~5.3.3
- **Navigation**: React Navigation 6.x
  - Bottom Tabs Navigation
  - Native Stack Navigation
- **State Management**: React Context API
- **HTTP Client**: Axios 1.8.4
- **Storage**: 
  - Expo Secure Store (for tokens)
  - AsyncStorage (for app data)
- **UI Components**:
  - React Native Paper 5.12.0 (Material Design components)
  - Lucide React Native 0.562.0 (Icons)
  - Lottie React Native 7.3.4 (Animations)
- **Markdown**: React Native Markdown Display 7.0.2
- **Text-to-Speech**: Expo Speech 12.0.2
- **File Picker**: Expo Document Picker 12.0.0
- **Notifications**: React Native Toast Message 2.2.0

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **Expo CLI**: `npm install -g expo-cli` or use `npx expo`
- **iOS Development** (Mac only):
  - Xcode 14+
  - iOS Simulator or physical device
- **Android Development**:
  - Android Studio
  - Android Emulator or physical device
- **Expo Go App** (for quick testing on physical devices):
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🏗️ Installation

1. **Navigate to app directory**
   ```bash
   cd app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `app` directory:
   ```env
   EXPO_PUBLIC_BACKEND_URL=http://localhost:5000
   ```
   
   For production:
   ```env
   EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
   ```
   
   **Note**: Expo requires the `EXPO_PUBLIC_` prefix for environment variables to be accessible in the app.

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on your device/emulator**
   - Press `i` for iOS simulator (Mac only)
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device
   - Press `w` to open in web browser

## 📁 Project Structure

```
app/
├── assets/                 # Images, icons, and static assets
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── ...
├── src/
│   ├── api/
│   │   └── axios.ts        # Centralized API client with auth interceptors
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context provider
│   ├── navigation/
│   │   ├── AppNavigator.tsx # Main navigation setup
│   │   └── AppHeader.tsx   # Custom header component
│   └── screens/
│       ├── auth/
│       │   ├── SigninScreen.tsx
│       │   └── SignupScreen.tsx
│       ├── main/
│       │   ├── StudentDashboardScreen.tsx
│       │   ├── UploadScreen.tsx
│       │   ├── AiTutorScreen.tsx
│       │   ├── VideoSummariesScreen.tsx
│       │   ├── ConsultationHistoryScreen.tsx
│       │   ├── SettingsScreen.tsx
│       │   └── SummaryModal.tsx
│       └── SplashScreen.tsx
├── App.tsx                 # Root component
├── app.json                # Expo configuration
├── babel.config.js         # Babel configuration
├── metro.config.js         # Metro bundler configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## 🎯 Available Scripts

- **`npm start`** or **`expo start`**: Start Expo development server
- **`npm run android`** or **`expo start --android`**: Start on Android emulator
- **`npm run ios`** or **`expo start --ios`**: Start on iOS simulator (Mac only)
- **`npm run web`** or **`expo start --web`**: Start in web browser

## 🔌 Backend Integration

The mobile app connects to the same backend API as the web app. The backend URL is configured via the `EXPO_PUBLIC_BACKEND_URL` environment variable.

### Authentication

The app uses JWT-based authentication with secure token storage:
- Tokens are stored in Expo Secure Store (encrypted storage)
- Automatic token injection in API requests
- Token refresh and error handling
- Automatic logout on 401 errors

### API Client

The centralized API client (`src/api/axios.ts`) handles:
- Base URL configuration
- Request interceptors (adds auth token)
- Response interceptors (handles token storage)
- Error handling and retry logic

## 📱 Platform-Specific Features

### iOS
- Native iOS navigation
- iOS-specific UI components
- App Store deployment ready

### Android
- Material Design components
- Android-specific navigation
- Google Play Store deployment ready

### Web
- Web-compatible components
- Responsive web layout
- Browser-based testing

## 🎨 UI/UX Features

- **Material Design**: Using React Native Paper for consistent Material Design components
- **Smooth Animations**: Lottie animations for loading states and transitions
- **Icons**: Lucide React Native for beautiful, consistent icons
- **Markdown Support**: Render formatted AI responses with markdown
- **Toast Notifications**: User-friendly error and success messages
- **Text-to-Speech**: Listen to AI responses (Expo Speech)

## 🚀 Building for Production

### Using EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure build**
   ```bash
   eas build:configure
   ```

4. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

5. **Build for Android**
   ```bash
   eas build --platform android
   ```

6. **Build for both**
   ```bash
   eas build --platform all
   ```

### Local Build (Advanced)

1. **iOS** (Mac only):
   ```bash
   expo build:ios
   ```

2. **Android**:
   ```bash
   expo build:android
   ```

## 📦 App Configuration

### `app.json`

The main Expo configuration file includes:
- App name and version
- Icon and splash screen settings
- iOS bundle identifier
- Android package name
- Permissions and plugins

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `EXPO_PUBLIC_BACKEND_URL` | Backend API URL | `https://study-ai-kgxs.onrender.com` | Yes |

**Important**: Expo only exposes environment variables prefixed with `EXPO_PUBLIC_` to the client-side code.

## 🔒 Security

- **Secure Storage**: Authentication tokens stored in Expo Secure Store (encrypted)
- **HTTPS Only**: All API calls should use HTTPS in production
- **Token Management**: Automatic token refresh and cleanup
- **Secure Credentials**: No sensitive data in code or environment variables

## 🐛 Troubleshooting

### Metro Bundler Issues

1. **Clear Metro cache**:
   ```bash
   npm start -- --reset-cache
   ```

2. **Clear watchman** (if installed):
   ```bash
   watchman watch-del-all
   ```

### Build Errors

1. **Clear Expo cache**:
   ```bash
   expo start -c
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install
   ```

### iOS Simulator Issues

1. **Reset simulator**:
   ```bash
   xcrun simctl erase all
   ```

2. **Reinstall pods** (if using bare workflow):
   ```bash
   cd ios && pod install && cd ..
   ```

### Android Emulator Issues

1. **Clear Android build cache**:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

2. **Reset emulator**:
   - Open Android Studio
   - AVD Manager → Wipe Data

### Network/API Issues

1. **Check environment variable**:
   ```bash
   echo $EXPO_PUBLIC_BACKEND_URL
   ```

2. **Verify backend is accessible**:
   ```bash
   curl $EXPO_PUBLIC_BACKEND_URL/api/health
   ```

3. **Check device network**: Ensure device/emulator can reach backend URL

## 📝 Development Tips

1. **Expo Go**: Use Expo Go app for quick testing on physical devices
2. **Hot Reload**: Changes automatically reload (shake device for dev menu)
3. **Debugging**: Use React Native Debugger or Chrome DevTools
4. **TypeScript**: Leverage TypeScript for type safety
5. **Component Reuse**: Share components between screens when possible
6. **Error Boundaries**: Implement error boundaries for better error handling

## 🧪 Testing

### Manual Testing Checklist

- [ ] Authentication (sign up, sign in, logout)
- [ ] PDF upload and viewing
- [ ] YouTube video addition
- [ ] AI chat functionality
- [ ] Study session creation
- [ ] Settings and profile management
- [ ] Navigation between screens
- [ ] Error handling and user feedback

### Device Testing

Test on:
- iOS Simulator (various iPhone models)
- Android Emulator (various screen sizes)
- Physical iOS device
- Physical Android device

## 📱 App Store Deployment

### iOS (App Store)

1. Build with EAS:
   ```bash
   eas build --platform ios
   ```

2. Submit to App Store:
   ```bash
   eas submit --platform ios
   ```

### Android (Google Play)

1. Build with EAS:
   ```bash
   eas build --platform android
   ```

2. Submit to Google Play:
   ```bash
   eas submit --platform android
   ```

## 🔗 Related Documentation

- [Backend README](../backend/README.md)
- [Web Frontend README](../frontend/README.md)
- [Whisper Service README](../whisper-service/README.md)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

## 📄 License

ISC

## 💡 Features in Detail

### Student Dashboard
- Overview of uploaded documents and videos
- Quick access to recent study sessions
- Statistics and progress tracking
- Quick actions for common tasks

### PDF Upload
- Native file picker integration
- Support for multiple file formats
- Upload progress indication
- Document management and deletion

### Video Summaries
- Add YouTube videos by URL
- Real-time transcription status
- AI-generated summaries with key points
- Video metadata display

### AI Tutor Chat
- Context-aware AI responses
- Chat history persistence
- Markdown-formatted responses
- Text-to-speech support

### Study Session History
- View all study sessions
- Session-based content organization
- Chat history per session
- Session management

---

**Built with ❤️ for mobile learners**
