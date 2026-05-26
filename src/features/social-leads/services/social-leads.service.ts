import apiClient from "@/shared/services/api-client";
import { PaginatedResponse } from "@/shared/types/api";
import { 
  SocialAccountLead, 
  SocialLeadCreatePayload, 
  SocialLeadUpdatePayload, 
  SocialLeadFilters, 
  SocialLeadStats 
} from "../types";

export const socialLeadsService = {
  getSocialLeads: async (params?: SocialLeadFilters): Promise<PaginatedResponse<SocialAccountLead>> => {
    // Backend uses has_creator = BooleanFilter(field_name="creator", lookup_expr="isnull")
    // So has_creator=true returns leads where creator IS NULL.
    // We invert it here so that has_creator=true means "with creator" for the frontend.
    const adjustedParams = { ...params };
    if (params?.has_creator !== undefined) {
      adjustedParams.has_creator = !params.has_creator as any;
    }
    
    const response = await apiClient.get("/social-leads/", { params: adjustedParams });
    return response.data;
  },
  
  getSocialLead: async (id: string): Promise<SocialAccountLead> => {
    const response = await apiClient.get(`/social-leads/${id}/`);
    return response.data;
  },
  
  createSocialLead: async (payload: SocialLeadCreatePayload): Promise<SocialAccountLead> => {
    const response = await apiClient.post("/social-leads/", payload);
    return response.data;
  },
  
  updateSocialLead: async (id: string, payload: SocialLeadUpdatePayload): Promise<SocialAccountLead> => {
    const response = await apiClient.patch(`/social-leads/${id}/`, payload);
    return response.data;
  },
  
  deleteSocialLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/social-leads/${id}/`);
  },
  
  getStats: async (params?: SocialLeadFilters): Promise<SocialLeadStats> => {
    const response = await apiClient.get("/social-leads/stats/", { params });
    return response.data;
  },
  
  markContacted: async (id: string): Promise<SocialAccountLead> => {
    const response = await apiClient.post(`/social-leads/${id}/mark_contacted/`);
    return response.data;
  },

  markPositive: async (id: string): Promise<SocialAccountLead> => {
    const response = await apiClient.post(`/social-leads/${id}/mark_positive/`);
    return response.data;
  },

  markNegative: async (id: string): Promise<SocialAccountLead> => {
    const response = await apiClient.post(`/social-leads/${id}/mark_negative/`);
    return response.data;
  },

  markToContact: async (id: string): Promise<SocialAccountLead> => {
    const response = await apiClient.post(`/social-leads/${id}/mark_to_contact/`);
    return response.data;
  },

  markNotRelevant: async (id: string): Promise<SocialAccountLead> => {
    const response = await apiClient.post(`/social-leads/${id}/mark_not_relevant/`);
    return response.data;
  },

  linkCreator: async (id: string, creatorId: string): Promise<SocialAccountLead> => {
    const response = await apiClient.post(`/social-leads/${id}/link_creator/`, { creator_id: creatorId });
    return response.data;
  },
  };

