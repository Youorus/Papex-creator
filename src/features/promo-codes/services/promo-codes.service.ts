import apiClient from "@/shared/services/api-client";
import { PaginatedResponse } from "@/shared/types/api";
import { 
  PromoCode, 
  PromoCodeCreatePayload, 
  PromoCodeUpdatePayload, 
  PromoCodeFilters 
} from "../types";

export const promoCodesService = {
  getPromoCodes: async (params?: PromoCodeFilters): Promise<PaginatedResponse<PromoCode>> => {
    const response = await apiClient.get("/promo-codes/", { params });
    return response.data;
  },
  
  getPromoCode: async (id: string): Promise<PromoCode> => {
    const response = await apiClient.get(`/promo-codes/${id}/`);
    return response.data;
  },
  
  createPromoCode: async (payload: PromoCodeCreatePayload): Promise<PromoCode> => {
    const response = await apiClient.post("/promo-codes/", payload);
    return response.data;
  },
  
  updatePromoCode: async (id: string, payload: PromoCodeUpdatePayload): Promise<PromoCode> => {
    const response = await apiClient.patch(`/promo-codes/${id}/`, payload);
    return response.data;
  },
  
  deletePromoCode: async (id: string): Promise<void> => {
    await apiClient.delete(`/promo-codes/${id}/`);
  },
};
