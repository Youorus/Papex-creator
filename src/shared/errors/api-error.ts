import { toast } from "sonner";

export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const normalizeApiError = (error: any): ApiError => {
  if (error instanceof ApiError) return error;

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    let message = "Une erreur est survenue lors de la communication avec le serveur.";

    if (data?.detail) {
      message = data.detail;
    } else if (data?.non_field_errors) {
      message = data.non_field_errors[0];
    } else if (typeof data === "object") {
      // Map DRF field errors to a single string for now or handle specifically in forms
      const firstKey = Object.keys(data)[0];
      if (Array.isArray(data[firstKey])) {
        message = `${firstKey}: ${data[firstKey][0]}`;
      }
    }

    return new ApiError(message, status, data);
  }

  if (error.request) {
    return new ApiError("Le serveur est injoignable. Veuillez vérifier votre connexion.", 0);
  }

  return new ApiError(error.message || "Une erreur inconnue est survenue.");
};

export const showApiErrorToast = (error: any) => {
  const apiError = normalizeApiError(error);
  toast.error(apiError.message);
};
