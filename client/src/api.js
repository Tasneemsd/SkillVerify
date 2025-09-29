import axios from "axios";

const API = axios.create({
  baseURL: "https://skillverify.onrender.com/api", // ✅ matches backend
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

export function setAuthToken(token) {
  localStorage.setItem("userToken", token);
}
export function getAuthToken() {
  return localStorage.getItem("userToken");
}
export function setUserData(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
export function getUserData() {
  return JSON.parse(localStorage.getItem("user") || "{}");
}
export function clearUserData() {
  localStorage.removeItem("user");
  localStorage.removeItem("userToken");
}
