import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { creatorsService } from "../services/creators.service";
import { CreatorFilters, CreatorCreatePayload, CreatorUpdatePayload } from "../types";
import { toast } from "sonner";
import { showApiErrorToast } from "@/shared/errors/api-error";

export const CREATOR_KEYS = {
  all: ["creators"] as const,
  lists: () => [...CREATOR_KEYS.all, "list"] as const,
  list: (filters: CreatorFilters) => [...CREATOR_KEYS.lists(), filters] as const,
  details: () => [...CREATOR_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CREATOR_KEYS.details(), id] as const,
  stats: (filters: CreatorFilters) => [...CREATOR_KEYS.all, "stats", filters] as const,
};

export const useCreators = (filters: CreatorFilters = {}) => {
  return useQuery({
    queryKey: CREATOR_KEYS.list(filters),
    queryFn: () => creatorsService.getCreators(filters),
  });
};

export const useCreator = (id: string) => {
  return useQuery({
    queryKey: CREATOR_KEYS.detail(id),
    queryFn: () => creatorsService.getCreator(id),
    enabled: !!id,
  });
};

export const useCreatorStats = (filters: CreatorFilters = {}) => {
  return useQuery({
    queryKey: CREATOR_KEYS.stats(filters),
    queryFn: () => creatorsService.getStats(filters),
  });
};

export const useCreateCreator = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreatorCreatePayload) => creatorsService.createCreator(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CREATOR_KEYS.lists() });
      toast.success("Créateur créé avec succès");
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useUpdateCreator = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreatorUpdatePayload }) => 
      creatorsService.updateCreator(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CREATOR_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CREATOR_KEYS.detail(data.id) });
      toast.success("Créateur mis à jour avec succès");
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useDeleteCreator = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => creatorsService.deleteCreator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CREATOR_KEYS.lists() });
      toast.success("Créateur supprimé avec succès");
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};
