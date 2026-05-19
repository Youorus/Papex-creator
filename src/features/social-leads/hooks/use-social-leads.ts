import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socialLeadsService } from "../services/social-leads.service";
import { SocialLeadFilters, SocialLeadCreatePayload, SocialLeadUpdatePayload } from "../types";
import { toast } from "sonner";
import { showApiErrorToast } from "@/shared/errors/api-error";

export const SOCIAL_LEAD_KEYS = {
  all: ["social-leads"] as const,
  lists: () => [...SOCIAL_LEAD_KEYS.all, "list"] as const,
  list: (filters: SocialLeadFilters) => [...SOCIAL_LEAD_KEYS.lists(), filters] as const,
  details: () => [...SOCIAL_LEAD_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SOCIAL_LEAD_KEYS.details(), id] as const,
  stats: (filters: SocialLeadFilters) => [...SOCIAL_LEAD_KEYS.all, "stats", filters] as const,
};

export const useSocialLeads = (filters: SocialLeadFilters = {}) => {
  return useQuery({
    queryKey: SOCIAL_LEAD_KEYS.list(filters),
    queryFn: () => socialLeadsService.getSocialLeads(filters),
  });
};

export const useSocialLead = (id: string) => {
  return useQuery({
    queryKey: SOCIAL_LEAD_KEYS.detail(id),
    queryFn: () => socialLeadsService.getSocialLead(id),
    enabled: !!id,
  });
};

export const useSocialLeadStats = (filters: SocialLeadFilters = {}) => {
  return useQuery({
    queryKey: SOCIAL_LEAD_KEYS.stats(filters),
    queryFn: () => socialLeadsService.getStats(filters),
  });
};

export const useCreateSocialLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: SocialLeadCreatePayload) => socialLeadsService.createSocialLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_LEAD_KEYS.all });
      toast.success("Lead social ajouté avec succès");
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useUpdateSocialLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SocialLeadUpdatePayload }) => 
      socialLeadsService.updateSocialLead(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_LEAD_KEYS.all });
      toast.success("Lead social mis à jour avec succès");
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useDeleteSocialLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => socialLeadsService.deleteSocialLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_LEAD_KEYS.all });
      toast.success("Lead social supprimé avec succès");
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useMarkLeadContacted = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialLeadsService.markContacted(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_LEAD_KEYS.all });
      toast.success("Lead marqué comme contacté");
    },
    onError: (error) => showApiErrorToast(error),
  });
};

export const useMarkLeadPositive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialLeadsService.markPositive(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_LEAD_KEYS.all });
      toast.success("Lead marqué comme positif");
    },
    onError: (error) => showApiErrorToast(error),
  });
};

export const useMarkLeadNegative = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialLeadsService.markNegative(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_LEAD_KEYS.all });
      toast.success("Lead marqué comme négatif");
    },
    onError: (error) => showApiErrorToast(error),
  });
};

export const useMarkLeadNotRelevant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialLeadsService.markNotRelevant(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_LEAD_KEYS.all });
      toast.success("Lead marqué comme non pertinent");
    },
    onError: (error) => showApiErrorToast(error),
  });
};

export const useLinkLeadCreator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, creatorId }: { id: string; creatorId: string }) => 
      socialLeadsService.linkCreator(id, creatorId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_LEAD_KEYS.all });
      toast.success("Lead lié au créateur avec succès");
    },
    onError: (error) => showApiErrorToast(error),
  });
};
