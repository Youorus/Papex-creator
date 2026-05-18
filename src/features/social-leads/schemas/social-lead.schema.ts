import { z } from "zod";

export const socialLeadSchema = z.object({
  id: z.string().uuid().optional(),
  platform: z.enum(["TIKTOK", "INSTAGRAM", "YOUTUBE", "TWITTER", "OTHER"]),
  username: z.string().min(1, "Username requis"),
  profile_url: z.string().url("URL invalide"),
  followers_count: z.number().min(0).default(0),
  is_viable: z.boolean().default(true),
  contact_status: z.enum([
    "NEW",
    "TO_CONTACT",
    "CONTACTED",
    "POSITIVE",
    "NEGATIVE",
    "CONVERTED",
    "NOT_RELEVANT",
  ]).default("NEW"),
  notes: z.string().optional(),
  creator_id: z.string().uuid().nullable().optional(),
});

export type SocialLead = z.infer<typeof socialLeadSchema> & {
  creator: any | null;
  created_at: string;
  updated_at: string;
};

export const socialLeadFiltersSchema = z.object({
  platform: z.string().optional(),
  contact_status: z.string().optional(),
  is_viable: z.boolean().optional(),
  search: z.string().optional(),
});

export type SocialLeadFilters = z.infer<typeof socialLeadFiltersSchema>;
