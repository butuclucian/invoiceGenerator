import { createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // Backend URL from .env
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Axios instance secured with JWT from localStorage
  const secureAxios = axios.create({
    baseURL: API_BASE_URL,
  });

  secureAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const value = { navigate, secureAxios };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
