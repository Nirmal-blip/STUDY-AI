import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://study-ai-kgxs.onrender.com';

/**
 * Centralized Axios instance for React Native API calls
 * - Automatically includes baseURL from environment
 * - Handles cookie-based authentication for React Native
 * - Stores and retrieves auth tokens securely
 */
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token from secure storage
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token storage
apiClient.interceptors.response.use(
  (response) => {
    // Extract token from response headers or cookies if needed
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      // Extract token from cookie if backend sends it
      const tokenMatch = setCookieHeader[0]?.match(/token=([^;]+)/);
      if (tokenMatch) {
        SecureStore.setItemAsync('auth_token', tokenMatch[1]);
      }
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      await SecureStore.deleteItemAsync('auth_token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

