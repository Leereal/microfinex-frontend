import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

export const CreateChargeSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required and should be at least 1 character long",
    })
    .max(255),
  description: z.string().optional().nullable().default(""),
  amount: z
    .number()
    .positive({ message: "Amount must be greater than zero." })
    .default(0),
  currency: z.number(),
  amount_type: z.enum(["fixed", "percentage"]),
  charge_type: z.enum(["credit", "debit"]),
  charge_application: z
    .enum(["principal", "balance", "other"])
    .default("principal"),
  loan_status: z.number().nullable(),
  mode: z.enum(["manual", "auto"]),
  is_active: z.boolean().optional().default(true),
});

export const ChargeSchema = CreateChargeSchema.extend({
  id: z.number(),
});

export type CreateChargeType = z.infer<typeof CreateChargeSchema>;
export type ChargeType = z.infer<typeof ChargeSchema>;

export const chargeDefaultValues = getDefaultsForSchema(CreateChargeSchema);
