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
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreatorContract {
  id: string;
  creator_id: string;
  title: string;
  file: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatorContractFilters extends ApiListParams {
  creator_id?: string;
}

export interface CreatorCreatePayload {
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  phone_number?: string;
  country?: string;
  city?: string;
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

export interface AggregateKpiResponse {
  summary: {
    total_leads: number;
    total_contracts: number;
    total_revenue: string;
    total_commissions: string;
    average_conversion_rate: number;
  };
  creators: Array<{
    id: string;
    full_name: string;
    promo_code: string;
    total_leads: number;
    total_contracts: number;
    conversion_rate: number;
    total_revenue: string;
    total_commissions: string;
  }>;
}

export interface IndividualKpi {
  total_leads: number;
  total_contracts: number;
  conversion_rate: number;
  total_revenue: string;
  total_commissions: string;
}

export interface CreatorKpiParams {
  leads_date_range_after?: string;
  leads_date_range_before?: string;
  creator?: string | string[];
  status?: CreatorStatus;
}

export interface IndividualKpiParams {
  start_date?: string;
  end_date?: string;
}
