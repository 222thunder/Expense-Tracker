import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // initially true while we check session

  const checkAuth = async () => {
    try {
      // API client will automatically try to refresh token if 401
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    return res.data; // Usually { message, user (unverified) }
  };

  const verifyEmail = async (email, otp) => {
    const res = await api.post("/auth/verify-email", { email, otp });
    return res.data;
  };

  const resendOtp = async (email) => {
    const res = await api.post("/auth/resend-otp", { email });
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    
    // Store access token
    if (res.data.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }
    
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed, clearing local state anyway.", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const logoutAll = async () => {
    try {
      await api.post("/auth/logout-all");
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        verifyEmail,
        resendOtp,
        logout,
        logoutAll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
