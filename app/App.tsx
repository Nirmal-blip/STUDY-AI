import React from 'react';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import SplashScreen from './src/screens/SplashScreen';

function Root() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />; // 🔥 show branding screen
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Root />
      <Toast />
    </AuthProvider>
  );
}
