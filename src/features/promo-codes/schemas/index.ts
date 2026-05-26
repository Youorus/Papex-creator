import { z } from "zod";

export const promoCodeStatusSchema = z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]);

export const promoCodeSchema = z.object({
  creator_id: z.string().min(1, "Créateur requis"),
  code: z.string().min(1, "Code requis").toUpperCase(),
  commission_rate: z.coerce.number().min(0, "Le taux doit être positif"),
  bonus_amount: z.coerce.number().min(0, "Le bonus doit être positif").default(0),
  description: z.string().optional().default(""),
  valid_until: z.string().nullable().optional(),
  status: promoCodeStatusSchema.default("ACTIVE"),
});

export type PromoCodeInput = z.infer<typeof promoCodeSchema>;
