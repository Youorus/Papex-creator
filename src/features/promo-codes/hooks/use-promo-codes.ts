import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promoCodesService } from "../services/promo-codes.service";
import { PromoCodeFilters, PromoCodeCreatePayload, PromoCodeUpdatePayload } from "../types";
import { toast } from "sonner";
import { showApiErrorToast } from "@/shared/errors/api-error";

export const PROMO_CODE_KEYS = {
  all: ["promo-codes"] as const,
  lists: () => [...PROMO_CODE_KEYS.all, "list"] as const,
  list: (filters: PromoCodeFilters) => [...PROMO_CODE_KEYS.lists(), filters] as const,
  details: () => [...PROMO_CODE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PROMO_CODE_KEYS.details(), id] as const,
};

export const usePromoCodes = (filters: PromoCodeFilters = {}) => {
  return useQuery({
    queryKey: PROMO_CODE_KEYS.list(filters),
    queryFn: () => promoCodesService.getPromoCodes(filters),
  });
};

export const usePromoCode = (id: string) => {
  return useQuery({
    queryKey: PROMO_CODE_KEYS.detail(id),
    queryFn: () => promoCodesService.getPromoCode(id),
    enabled: !!id,
  });
};

export const useCreatePromoCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: PromoCodeCreatePayload) => promoCodesService.createPromoCode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMO_CODE_KEYS.lists() });
      toast.success("Code promo créé avec succès");
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useUpdatePromoCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PromoCodeUpdatePayload }) => 
      promoCodesService.updatePromoCode(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMO_CODE_KEYS.lists() });
      toast.success("Code promo mis à jour avec succès");
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useDeletePromoCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => promoCodesService.deletePromoCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMO_CODE_KEYS.lists() });
      toast.success("Code promo supprimé avec succès");
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};
