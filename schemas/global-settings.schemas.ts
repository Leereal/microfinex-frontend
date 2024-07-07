import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

export const GlobalSettingsSchema = z.object({
  id: z.number().optional().nullable().default(null),
  company_name: z.string().min(2),
  company_logo: z.string().nullable(),
  contact_email: z.string().email(),
  contact_phone: z.string(),
  address: z.string(),
  default_interest_rate: z.number(),
  min_loan_amount: z.number(),
  max_loan_amount: z.number(),
  loan_approval_required: z.boolean(),
  loan_application_allowed: z.boolean(),
  fiscal_year_start: z.string(), // Adjust this based on how you handle dates in TypeScript
  fiscal_year_end: z.string(), // Adjust this based on how you handle dates in TypeScript
  currency_code: z.string(),
  timezone: z.string(),
});

export type GlobalSettingsType = z.infer<typeof GlobalSettingsSchema>;

export const globalSettingsDefaultValues =
  getDefaultsForSchema(GlobalSettingsSchema);
