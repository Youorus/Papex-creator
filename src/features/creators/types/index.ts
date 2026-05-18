import { ApiListParams } from "@/shared/types/api";

export type CreatorStatus = "PENDING" | "ACTIVE" | "PAUSED" | "DISABLED";

export interface CreatorProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string | null;
  country: string | null;
  city: string | null;
  promo_code: string;
  status: CreatorStatus;
  commission_rate: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreatorCreatePayload {
  email: string;
  first_name: string;
  last_name: string;
  password?: string; // Optional because sometimes it might be generated or handled differently
  phone_number?: string;
  country?: string;
  city?: string;
  promo_code: string;
  commission_rate: string;
  notes?: string;
}

export interface CreatorUpdatePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country?: string;
  city?: string;
  promo_code?: string;
  status?: CreatorStatus;
  commission_rate?: string;
  notes?: string;
  is_active?: boolean;
}

export interface CreatorFilters extends ApiListParams {
  status?: CreatorStatus;
  country?: string;
  city?: string;
  commission_rate_min?: string;
  commission_rate_max?: string;
  created_at_after?: string;
  created_at_before?: string;
  is_active?: boolean;
}

export interface CreatorStats {
  total: number;
  active: number;
  pending: number;
  paused: number;
  disabled: number;
}
