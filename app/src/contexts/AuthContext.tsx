import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../api/axios';
import * as SecureStore from 'expo-secure-store';

interface User {
  userId: string;
  email: string;
  fullname: string;
  userType: 'student' | 'educator';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, userType: 'student' | 'educator') => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  /* ===================== CHECK AUTH ===================== */
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/api/auth/me');

      if (res.data?.user) {
        setUser(res.data.user);
        // Store token if provided
        if (res.data.token) {
          await SecureStore.setItemAsync('auth_token', res.data.token);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      await SecureStore.deleteItemAsync('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  /* ===================== LOGIN ===================== */
  const login = async (
    email: string,
    password: string,
    userType: 'student' | 'educator'
  ) => {
    const res = await apiClient.post('/api/auth/login', {
      email,
      password,
      userType,
    });

    if (res.data?.user) {
      setUser(res.data.user);
      // Store token from response or cookie
      if (res.data.token) {
        await SecureStore.setItemAsync('auth_token', res.data.token);
      }
    }
  };

  /* ===================== REGISTER ===================== */
  const register = async (formData: any) => {
    const res = await apiClient.post('/api/auth/register', formData);

    if (res.data?.user) {
      setUser(res.data.user);
      if (res.data.token) {
        await SecureStore.setItemAsync('auth_token', res.data.token);
      }
    }
  };

  /* ===================== LOGOUT ===================== */
  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      setUser(null);
      await SecureStore.deleteItemAsync('auth_token');
    }
  };

  /* ===================== INITIAL LOAD ===================== */
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};



