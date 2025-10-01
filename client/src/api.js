import axios from "axios";

// Axios instance with backend base URL
const API = axios.create({
  baseURL: "https://skillverify.onrender.com/api", // Render backend
});

// Attach JWT automatically if stored
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // unified key
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Export instance
export default API;

// 🔹 Auth Helpers
export function setAuthToken(token) {
  localStorage.setItem("token", token); // unified key
}

export function getAuthToken() {
  return localStorage.getItem("token");
}

export function setUserData(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUserData() {
  return JSON.parse(localStorage.getItem("user") || "{}");
}

export function clearUserData() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

// 🔹 OTP Endpoints
export const sendOtp = (phone) => API.post("/otp/send-otp", { phone });
export const verifyOtp = (userData) => API.post("/otp/verify-otp", userData);
