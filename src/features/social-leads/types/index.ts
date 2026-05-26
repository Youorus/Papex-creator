import { ApiListParams } from "@/shared/types/api";
import { CreatorProfile } from "@/features/creators/types";

export type SocialPlatform = "TIKTOK" | "INSTAGRAM" | "FACEBOOK" | "YOUTUBE" | "LINKEDIN" | "OTHER";

export type ContactStatus = "NEW" | "TO_CONTACT" | "CONTACTED" | "POSITIVE" | "NEGATIVE" | "CONVERTED" | "NOT_RELEVANT";

export interface SocialAccountLead {
  id: string;
  platform: SocialPlatform;
  username: string;
  display_name: string | null;
  profile_url: string | null;
  followers_count: number;
  bio: string | null;
  country: string | null;
  language: string | null;
  categories: string | null;
  source: string | null;
  is_viable: boolean;
  contact_status: ContactStatus;
  creator: {
    id: string;
    full_name: string;
  } | null;
  notes: string | null;
  raw_data?: any;
  created_at: string;
  updated_at: string;
}

export interface SocialLeadCreatePayload {
  platform: SocialPlatform;
  username: string;
  display_name?: string;
  profile_url?: string;
  followers_count?: number;
  bio?: string;
  country?: string;
  language?: string;
  categories?: string;
  source?: string;
  is_viable?: boolean;
  contact_status?: ContactStatus;
  creator?: string | null;
  notes?: string;
  raw_data?: any;
}

export interface SocialLeadUpdatePayload extends Partial<SocialLeadCreatePayload> {}

export interface SocialLeadFilters extends ApiListParams {
  platform?: SocialPlatform;
  contact_status?: ContactStatus;
  is_viable?: boolean;
  has_creator?: boolean;
  followers_min?: number;
  followers_max?: number;
  country?: string;
  created_at_after?: string;
  created_at_before?: string;
}

export interface SocialLeadStats {
  total: number;
  viable: number;
  not_viable: number;
  new: number;
  to_contact: number;
  contacted: number;
  positive: number;
  negative: number;
  converted: number;
  not_relevant: number;
  with_creator: number;
  without_creator: number;
}

export interface LinkCreatorPayload {
  creator_id: string;
}
