import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // Crucial for sending/receiving the HttpOnly refreshToken cookie
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized (token refresh logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry if the original request was to refresh token or login
      if (originalRequest.url.includes("/auth/refresh-token") || originalRequest.url.includes("/auth/login")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        // Attempt to get a new access token
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "/api"}/auth/refresh-token`, {
          withCredentials: true, // Send the refresh token cookie
        });
        
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        
        // Update the original request's authorization header and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g. refresh token expired), clear local storage
        // The AuthContext will catch this and log the user out
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
