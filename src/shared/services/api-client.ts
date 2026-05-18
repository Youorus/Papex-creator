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
    if (csrfToken && config.headers) {
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
      toast.error("Accès refusé. Votre session ne dispose pas des droits nécessaires.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
