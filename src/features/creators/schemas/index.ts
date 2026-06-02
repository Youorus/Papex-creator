import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const creatorStatusSchema = z.enum(["PENDING", "ACTIVE", "PAUSED", "DISABLED"]);

export const creatorCreateSchema = z.object({
  email: z.string().email("Email invalide"),
  first_name: z.string().min(1, "Prénom requis"),
  last_name: z.string().min(1, "Nom requis"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  phone_number: z.string().refine((val) => {
    try {
      return isValidPhoneNumber(val);
    } catch {
      return false;
    }
  }, "Numéro de téléphone invalide pour le pays sélectionné"),
  country: z.string().min(1, "Pays requis"),
  city: z.string().min(1, "Ville requise"),
  notes: z.string().optional(),
});

export const creatorUpdateSchema = z.object({
  first_name: z.string().min(1, "Prénom requis").optional(),
  last_name: z.string().min(1, "Nom requis").optional(),
  phone_number: z.string().refine((val) => {
    if (!val) return true;
    try {
      return isValidPhoneNumber(val);
    } catch {
      return false;
    }
  }, "Numéro de téléphone invalide").optional(),
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
