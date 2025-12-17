import axios from 'axios';

// Vite requires env vars to be prefixed with VITE_
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Optional: send cookies if you ever use httpOnly in future
  // withCredentials: true,
});

// Separate instance for refresh token call (bypasses interceptors to avoid recursion)
const refreshAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach access token to all requests (except public ones)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    // Skip adding token for login/register (they don't need it)
    if (token && !config.url?.includes('/auth/login') && !config.url?.includes('/auth/register')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors, and prevent retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await refreshAxios.post('/auth/refresh', { refreshToken });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Update Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user'); // if you store user info

        // Redirect to login (using window.location for hard redirect)
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    // For all other errors (including 401 after retry), just reject
    return Promise.reject(error);
  }
);

export default api;