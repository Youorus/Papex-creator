import apiClient from "@/shared/services/api-client";
import { PaginatedResponse } from "@/shared/types/api";
import { 
  CreatorProfile, 
  CreatorCreatePayload, 
  CreatorUpdatePayload, 
  CreatorFilters, 
  CreatorStats,
  AggregateKpiResponse,
  IndividualKpi,
  CreatorKpiParams,
  IndividualKpiParams
} from "../types";

export const creatorsService = {
  getCreators: async (params?: CreatorFilters): Promise<PaginatedResponse<CreatorProfile>> => {
    const response = await apiClient.get("/creators/", { params });
    return response.data;
  },
  
  getCreator: async (id: string): Promise<CreatorProfile> => {
    const response = await apiClient.get(`/creators/${id}/`);
    return response.data;
  },
  
  createCreator: async (payload: CreatorCreatePayload): Promise<CreatorProfile> => {
    const response = await apiClient.post("/creators/", payload);
    return response.data;
  },
  
  updateCreator: async (id: string, payload: CreatorUpdatePayload): Promise<CreatorProfile> => {
    const response = await apiClient.patch(`/creators/${id}/`, payload);
    return response.data;
  },
  
  deleteCreator: async (id: string): Promise<void> => {
    await apiClient.delete(`/creators/${id}/`);
  },

  getMe: async (): Promise<CreatorProfile> => {
    const response = await apiClient.get("/creators/me/");
    return response.data;
  },
  
  getStats: async (params?: CreatorFilters): Promise<CreatorStats> => {
    const response = await apiClient.get("/creators/stats/", { params });
    return response.data;
  },

  getAggregateKpis: async (params?: CreatorKpiParams): Promise<AggregateKpiResponse> => {
    const response = await apiClient.get("/creators/aggregate-kpis/", { params });
    return response.data;
  },

  getCreatorKpis: async (id: string, params?: IndividualKpiParams): Promise<IndividualKpi> => {
    const response = await apiClient.get(`/creators/${id}/kpis/`, { params });
    return response.data;
  },
};
