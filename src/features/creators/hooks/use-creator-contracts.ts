import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { creatorContractsService } from "../services/creator-contracts.service";
import { CreatorContractFilters } from "../types";
import { toast } from "sonner";
import { showApiErrorToast } from "@/shared/errors/api-error";

export const CONTRACT_KEYS = {
  all: ["creator-contracts"] as const,
  lists: () => [...CONTRACT_KEYS.all, "list"] as const,
  list: (filters: CreatorContractFilters) => [...CONTRACT_KEYS.lists(), filters] as const,
};

export const useCreatorContracts = (filters: CreatorContractFilters = {}, options: any = {}) => {
  return useQuery({
    queryKey: CONTRACT_KEYS.list(filters),
    queryFn: () => creatorContractsService.getContracts(filters),
    ...options
  });
};

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => creatorContractsService.createContract(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_KEYS.all });
      toast.success("Contrat ajouté avec succès");
    },
    onError: (error) => showApiErrorToast(error),
  });
};

export const useUpdateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => 
      creatorContractsService.updateContract(id, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_KEYS.all });
      toast.success("Titre du contrat mis à jour");
    },
    onError: (error) => showApiErrorToast(error),
  });
};

export const useDeleteContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => creatorContractsService.deleteContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_KEYS.all });
      toast.success("Contrat supprimé");
    },
    onError: (error) => showApiErrorToast(error),
  });
};
