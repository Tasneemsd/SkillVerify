// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://skillverify.onrender.com/api", // 👈 your backend URL
});

// Attach JWT token automatically if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
