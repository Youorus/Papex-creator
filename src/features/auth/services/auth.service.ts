import apiClient from "@/shared/services/api-client";
import { LoginValues } from "../schemas/auth.schema";

export const authService = {
  ensureCsrf: async () => {
    try {
      await apiClient.get("/auth/csrf/");
    } catch (error) {
      console.error("Failed to fetch CSRF token", error);
    }
  },
  login: async (values: LoginValues) => {
    await authService.ensureCsrf();
    const response = await apiClient.post("/auth/login/", values);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/auth/logout/");
    return response.data;
  },
  me: async () => {
    const response = await apiClient.get("/auth/me/");
    return response.data;
  },
};
