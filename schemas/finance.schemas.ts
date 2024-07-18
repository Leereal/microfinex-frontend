import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

// Define Enums for Finance Types
export const FinanceTypeEnum = z.enum([
  "income",
  "expense",
  "investment",
  "withdrawal",
]);

export const CreateFinanceSchema = z.object({
  title: z.string(),
  description: z.string().optional(), // Optional description
  amount: z.number().positive("Amount must be greater than zero"),
  received_from: z.string().nullable().optional(), // Optional received_from
  paid_to: z.string().nullable().optional(), // Optional paid_to
  receipt_number: z.string().nullable().optional(), // Optional receipt_number
  receipt_screenshot: z.string().nullable().optional(), // Optional receipt_screenshot
  type: FinanceTypeEnum,
});

export const FinanceSchema = z.object({
  id: z.number().optional().nullable().default(null),
  title: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  received_from: z.string().nullable(),
  paid_to: z.string().nullable(),
  receipt_number: z.string().nullable(),
  receipt_screenshot: z.string().nullable(),
  type: FinanceTypeEnum,
  created_by: z.number(),
  branch: z.number(),
  created_at: z.string(), // Assuming created_at is returned as a string
});

// Define types
export type CreateFinanceType = z.infer<typeof CreateFinanceSchema>;
export type FinanceType = z.infer<typeof FinanceSchema>;

// Default values for creating a new finance record
export const createFinanceDefaultValues =
  getDefaultsForSchema(CreateFinanceSchema);
