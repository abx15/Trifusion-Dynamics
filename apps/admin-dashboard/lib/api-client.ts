import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "./auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach access token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Token rotation on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      const requestUrl = originalRequest.url || "";
      
      // Stop infinite loop if the 401 is from login or refresh endpoints
      if (requestUrl.includes("auth/login") || requestUrl.includes("auth/refresh")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const currentRefreshToken = Cookies.get("refresh_token");
        if (!currentRefreshToken) {
          throw new Error("No session refresh token");
        }

        // Call POST /auth/refresh
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: currentRefreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        // Update Zustand store
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setAuth(currentUser, accessToken);
        }

        // Set rotated cookie
        Cookies.set("refresh_token", newRefreshToken, {
          secure: true,
          sameSite: "strict",
          expires: 7,
        });

        // Retry original request with new header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        console.warn("Session rotation failed. Redirecting to login:", refreshErr);
        
        // Force cleanup and redirect
        useAuthStore.getState().clearAuth();
        Cookies.remove("refresh_token");
        
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
