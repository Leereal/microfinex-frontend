import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

// Define a schema for creating a new loan status
export const CreateLoanStatusSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required and should be at least 1 character long",
    })
    .max(100),
  description: z.string().optional().nullable(),
  allow_auto_calculations: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
});

// Define a schema for retrieving loan status
export const LoanStatusSchema = CreateLoanStatusSchema.extend({
  id: z.number(),
});

// Define types
export type CreateLoanStatusType = z.infer<typeof CreateLoanStatusSchema>;
export type LoanStatusType = z.infer<typeof LoanStatusSchema>;

// Default values for creating a new loan status
export const createLoanStatusDefaultValues = getDefaultsForSchema(
  CreateLoanStatusSchema
);
