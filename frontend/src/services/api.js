import axios from 'axios';
import { TOKEN_KEY } from '../utils/constants';

// Initialize Axios instance with baseURL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token and preserve dynamic multipart boundaries
api.interceptors.request.use(
  (config) => {
    // Read exact token key shared with AuthContext
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // When payload is FormData, delete manual Content-Type header so the browser/Axios
    // automatically computes and attaches the correct multipart boundary parameter
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Uniform error handling & 401 token invalidation
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // If 401 Unauthorized, notify application or clean up expired token
      if (error.response.status === 401) {
        // Clear local token only if request wasn't already a login/register attempt
        const isAuthRequest =
          error.config?.url?.includes('/auth/login') ||
          error.config?.url?.includes('/auth/register');

        if (!isAuthRequest) {
          localStorage.removeItem(TOKEN_KEY);
          // Dispatch a custom event so AuthContext can synchronize logout without full reload
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
