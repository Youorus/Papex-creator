import { toast } from "sonner";
import apiClient from "./api-client";

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const getCsrfToken = () => getCookie("csrftoken");

export const ensureCsrfCookie = async (): Promise<void> => {
  try {
    await apiClient.get("/auth/csrf/");
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
    toast.error("Impossible d’initialiser la sécurité de session.");
    throw error;
  }
};
