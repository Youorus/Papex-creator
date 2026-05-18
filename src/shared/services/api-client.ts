import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCsrfToken } from "./csrf";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const csrfToken = getCsrfToken();
    const methods = ["post", "put", "patch", "delete"];
    
    if (process.env.NODE_ENV === "development") {
      const isCorrectDomain = config.baseURL === "https://api.papiers-express.fr/api";
      if (!isCorrectDomain) {
         console.warn("[API Debug] Request is going to an unexpected domain:", config.baseURL);
      }
      if (methods.includes(config.method?.toLowerCase() || "") && !csrfToken) {
         console.warn("[API Debug] CSRF token is missing before a POST/PUT/PATCH/DELETE request!");
      }
    }

    if (csrfToken && config.headers && config.method && methods.includes(config.method.toLowerCase())) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (process.env.NODE_ENV === "development") {
      console.error("[API Error Debug]", {
        url: error.config?.baseURL ? `${error.config.baseURL}${error.config.url}` : error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.config?.headers,
        withCredentials: error.config?.withCredentials,
      });
    }

    if (error.response?.status === 403) {
      toast.error("Accès refusé. Vérifiez que votre session administrateur est bien active.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
