import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

export const BranchSettingsSchema = z.object({
  id: z.number().optional().nullable().default(null),
  branch_id: z.number(),
  loan_approval_required: z.boolean(),
  loan_application_allowed: z.boolean(),
  min_loan_amount: z.number(),
  max_loan_amount: z.number(),
  default_interest_rate: z.number().min(0).max(100),
});

export type BranchSettingsType = z.infer<typeof BranchSettingsSchema>;

export const branchSettingsDefaultValues =
  getDefaultsForSchema(BranchSettingsSchema);
