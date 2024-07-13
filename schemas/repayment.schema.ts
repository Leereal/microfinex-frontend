import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

export const RepaymentSchema = z.object({
  loan_id: z.number(), 
  payment_gateway_id: z.number(), 
  amount: z.number(), 
});

export type RepaymentType = z.infer<typeof RepaymentSchema>;

export const repaymentDefaultValues =
  getDefaultsForSchema(RepaymentSchema);
