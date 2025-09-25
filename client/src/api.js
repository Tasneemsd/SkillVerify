// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://skillverify.onrender.com/api", 
});

// Attach JWT token automatically if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");  // ✅ unified
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Token management functions
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    clearAuthToken();
  }
}

export function getAuthToken() {
  return localStorage.getItem('token');
}

export function clearAuthToken() {
  localStorage.removeItem('token');
  delete API.defaults.headers.common['Authorization'];
}

// Initialize token on module load
const savedToken = getAuthToken();
if (savedToken) {
  setAuthToken(savedToken);
}

export default API;
