import axiosInstance from "@/config/axios.config";
import store from "@/store";
import { logout, setAccessToken } from "@/store/auth/authSlice";
import { axiosErrorMessage } from "./axios.config";

// Example: Attach access token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await axiosInstance.post("/api/v1/auth/refresh-token", { withCredentials: true });
        store.dispatch(setAccessToken(newAccessToken.data.accessToken));
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken.data?.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    // Global error handling
    axiosErrorMessage(error);
    return Promise.reject(error);
  }
);


