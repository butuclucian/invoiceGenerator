import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

// ✅ Interceptor de test pentru token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️  Nu există token în localStorage!");
  }

  return config;
});

export default API;
