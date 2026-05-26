import { ApiListParams } from "@/shared/types/api";

export type PromoCodeStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export interface PromoCode {
  id: string;
  code: string;
  creator: {
    id: string;
    email: string;
    full_name: string;
  };
  commission_rate: number;
  bonus_amount: number;
  status: PromoCodeStatus;
  description: string;
  valid_until: string | null;
  created_at: string;
}

export interface PromoCodeCreatePayload {
  code: string;
  creator_id: string;
  commission_rate?: number;
  bonus_amount?: number;
  status?: PromoCodeStatus;
  description?: string;
  valid_until?: string | null;
}

export interface PromoCodeUpdatePayload {
  code?: string;
  commission_rate?: number;
  bonus_amount?: number;
  status?: PromoCodeStatus;
  description?: string;
  valid_until?: string | null;
}

export interface PromoCodeFilters extends ApiListParams {
  creator?: string; // Search by creator ID
  status?: PromoCodeStatus;
  search?: string;
}
