import apiClient from "@/shared/services/api-client";
import { ensureCsrfCookie } from "@/shared/services/csrf";
import { LoginValues } from "../schemas/auth.schema";

export const authService = {
  login: async (values: LoginValues) => {
    await ensureCsrfCookie();
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
