import axios from "axios";

// Choose correct baseURL
const API = axios.create({
  baseURL: "https://skillverify.onrender.com/api", // production
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // consistent key
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

// Helper functions
export function setAuthToken(token) {
  localStorage.setItem("token", token);
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

// OTP functions
export const sendOtp = (phone) => API.post("/send-otp", { phone });
export const verifyOtp = (userData) => API.post("/verify-otp", userData);
