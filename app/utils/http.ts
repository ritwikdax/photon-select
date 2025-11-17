import axios from "axios";

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.10:3001";

// Function to extract token from URL query params
const getTokenFromURL = (): string | null => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  }
  return null;
};

export const http = axios.create({ baseURL: BASE_API_URL });

// Add request interceptor to include token in Authorization header
http.interceptors.request.use(
  (config) => {
    const token = getTokenFromURL();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
