import { z } from "zod";

export const creatorStatusSchema = z.enum(["PENDING", "ACTIVE", "PAUSED", "DISABLED"]);

export const creatorCreateSchema = z.object({
  email: z.string().email("Email invalide"),
  first_name: z.string().min(1, "Prénom requis"),
  last_name: z.string().min(1, "Nom requis"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  phone_number: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  promo_code: z.string().min(1, "Code promo requis"),
  commission_rate: z.string().min(1, "Taux de commission requis"),
  notes: z.string().optional(),
});

export const creatorUpdateSchema = z.object({
  first_name: z.string().min(1, "Prénom requis").optional(),
  last_name: z.string().min(1, "Nom requis").optional(),
  phone_number: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  promo_code: z.string().min(1, "Code promo requis").optional(),
  status: creatorStatusSchema.optional(),
  commission_rate: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type CreatorCreateInput = z.infer<typeof creatorCreateSchema>;
export type CreatorUpdateInput = z.infer<typeof creatorUpdateSchema>;
