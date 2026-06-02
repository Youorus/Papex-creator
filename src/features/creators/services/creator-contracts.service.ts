import apiClient from "@/shared/services/api-client";
import { PaginatedResponse } from "@/shared/types/api";
import { CreatorContract, CreatorContractFilters } from "../types";

export const creatorContractsService = {
  getContracts: async (params?: CreatorContractFilters): Promise<PaginatedResponse<CreatorContract>> => {
    const response = await apiClient.get("/creator-documents/", { params });
    return response.data;
  },

  getContract: async (id: string): Promise<CreatorContract> => {
    const response = await apiClient.get(`/creator-documents/${id}/`);
    return response.data;
  },

  createContract: async (formData: FormData): Promise<CreatorContract> => {
    const response = await apiClient.post("/creator-documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateContract: async (id: string, payload: { title: string }): Promise<CreatorContract> => {
    const response = await apiClient.patch(`/creator-documents/${id}/`, payload);
    return response.data;
  },

  deleteContract: async (id: string): Promise<void> => {
    await apiClient.delete(`/creator-documents/${id}/`);
  },
};
