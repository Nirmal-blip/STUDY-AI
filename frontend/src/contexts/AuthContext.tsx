import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  userId: string;
  email: string;
  fullname: string;
  userType: "student" | "educator";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, userType: "student" | "educator") => Promise<void>;
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

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
        { withCredentials: true }
      );

      if (res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /* ===================== LOGIN ===================== */
  const login = async (
    email: string,
    password: string,
    userType: "student" | "educator"
  ) => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
      { email, password, userType },
      { withCredentials: true }
    );

    setUser(res.data.user);
  };

  /* ===================== REGISTER ===================== */
  const register = async (formData: any) => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
      formData,
      { withCredentials: true }
    );

    setUser(res.data.user);
  };

  /* ===================== LOGOUT ===================== */
  const logout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        { withCredentials: true }
      );
    } finally {
      setUser(null);
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
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
