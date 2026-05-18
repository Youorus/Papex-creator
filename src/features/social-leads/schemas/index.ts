import { z } from "zod";

export const socialPlatformSchema = z.enum(["TIKTOK", "INSTAGRAM", "FACEBOOK", "YOUTUBE", "LINKEDIN", "OTHER"]);

export const leadContactStatusSchema = z.enum(["NEW", "TO_CONTACT", "CONTACTED", "POSITIVE", "NEGATIVE", "CONVERTED", "NOT_RELEVANT"]);

export const socialLeadCreateSchema = z.object({
  platform: socialPlatformSchema,
  username: z.string().min(1, "Nom d'utilisateur requis"),
  display_name: z.string().optional(),
  profile_url: z.string().url("URL invalide").optional().or(z.literal("")),
  followers_count: z.number().min(0).default(0),
  bio: z.string().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
  categories: z.string().optional(),
  source: z.string().optional(),
  is_viable: z.boolean().default(true),
  contact_status: leadContactStatusSchema.default("NEW"),
  creator: z.string().uuid().nullable().optional(),
  notes: z.string().optional(),
});

export const socialLeadUpdateSchema = socialLeadCreateSchema.partial();

export const linkCreatorSchema = z.object({
  creator_id: z.string().uuid("ID créateur invalide"),
});

export type SocialLeadCreateInput = z.infer<typeof socialLeadCreateSchema>;
export type SocialLeadUpdateInput = z.infer<typeof socialLeadUpdateSchema>;
export type LinkCreatorInput = z.infer<typeof linkCreatorSchema>;
