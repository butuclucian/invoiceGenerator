import { useAuth, useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

axios.defaults.baseURL = API_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(null);

  const fetchAuthToken = useCallback(async () => {
    try {
      const token = await getToken();
      if (token) setAuthToken(token);
    } catch (error) {
      console.error("Error fetching Clerk token:", error);
      toast.error("Authentication error");
    }
  }, [getToken]);

  useEffect(() => {
    if (isLoaded && user) fetchAuthToken();
    else setAuthToken(null);
  }, [isLoaded, user, fetchAuthToken]);

  const secureAxios = axios.create({ baseURL: API_BASE_URL });

  secureAxios.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const value = { user, getToken, authToken, navigate, secureAxios };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
