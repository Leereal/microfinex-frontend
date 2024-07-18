import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

// Define Enums for Transaction Types and Status
export const TransactionTypeEnum = z.enum([
  "disbursement",
  "repayment",
  "interest",
  "charge",
  "refund",
  "bonus",
  "topup",
]);
export const TransactionStatusEnum = z.enum([
  "review",
  "pending",
  "approved",
  "cancelled",
  "refunded",
]);

// Define a schema for creating a new loan transaction
export const CreateLoanTransactionSchema = z.object({
  loan_id: z.number(),
  transaction_type: TransactionTypeEnum,
  debit: z.number().nullable().default(null),
  credit: z.number().nullable().default(null),
  payment_gateway: z.number().nullable().default(null), // Optional payment gateway ID
  description: z.string().optional(), // Optional description
});

// Define a schema for retrieving loan transactions
export const LoanTransactionSchema = z.object({
  id: z.number().optional().nullable().default(null),
  loan: z.number(),
  client_name: z.string(),
  description: z.string().optional(),
  transaction_type: TransactionTypeEnum,
  debit: z.number().nullable(),
  credit: z.number().nullable(),
  currency: z.number(),
  created_by: z.string().nullable().default(null),
  branch: z.number(),
  payment_gateway: z.string().nullable(), // Payment gateway name
  status: TransactionStatusEnum,
  created_at: z.string(),
});

// Define types
export type CreateLoanTransactionType = z.infer<
  typeof CreateLoanTransactionSchema
>;
export type LoanTransactionType = z.infer<typeof LoanTransactionSchema>;

// Default values for creating a new loan transaction
export const createLoanTransactionDefaultValues = getDefaultsForSchema(
  CreateLoanTransactionSchema
);
