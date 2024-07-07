import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

// Define schemas for nested objects
const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const PeriodSchema = z.object({
  id: z.number(),
  name: z.string(),
  duration: z.number(),
  duration_unit: z.string(),
});

const UserSchema = z.object({
  id: z.number(),
  full_name: z.string(),
});

// Define schema for API response
export const BranchProductResponseSchema = z.object({
  id: z.number().optional().nullable().default(null),
  branch: BranchSchema,
  product: ProductSchema,
  interest: z
    .number()
    .min(0, { message: "Interest rate must be non-negative" })
    .default(0),
  max_amount: z
    .number()
    .min(0, { message: "Max amount must be non-negative" })
    .default(0),
  min_amount: z
    .number()
    .min(0, { message: "Min amount must be non-negative" })
    .default(0),
  period: PeriodSchema,
  min_period: z
    .number()
    .min(0, { message: "Min period must be non-negative" })
    .default(0),
  max_period: z
    .number()
    .min(0, { message: "Max period must be non-negative" })
    .default(0),
  grace_period_days: z
    .number()
    .min(0, { message: "Grace period must be non-negative" })
    .default(0),
  allow_half_period: z.boolean().default(false),
  is_active: z.boolean().default(true),
  created_by: UserSchema,
  created_at: z.string().optional(), // Assuming ISO 8601 date string
  last_modified: z.string().optional(), // Assuming ISO 8601 date string
});

// Define schema for API request
export const BranchProductRequestSchema = z.object({
  id: z.number().optional().nullable().default(null),
  branch: z.number().min(1, { message: "Branch is required" }).default(0),
  product: z.number().min(1, { message: "Product is required" }).default(0),
  interest: z
    .number()
    .min(0, { message: "Interest rate must be non-negative" })
    .default(0),
  max_amount: z
    .number()
    .min(0, { message: "Max amount must be non-negative" })
    .default(0),
  min_amount: z
    .number()
    .min(0, { message: "Min amount must be non-negative" })
    .default(0),
  period: z.number().min(1, { message: "Period is required" }).default(0),
  min_period: z
    .number()
    .min(0, { message: "Min period must be non-negative" })
    .default(0),
  max_period: z
    .number()
    .min(0, { message: "Max period must be non-negative" })
    .default(0),
  grace_period_days: z
    .number()
    .min(0, { message: "Grace period must be non-negative" })
    .default(0),
  allow_half_period: z.boolean().default(false),
  is_active: z.boolean().default(true),
  created_by: z
    .number()
    .min(1, { message: "Created by is required" })
    .default(0),
});

export type BranchProductRequestType = z.infer<
  typeof BranchProductRequestSchema
>;
export type BranchProductResponseType = z.infer<
  typeof BranchProductResponseSchema
>;

export const branchProductRequestDefaultValues = getDefaultsForSchema(
  BranchProductRequestSchema
);
export const branchProductResponseDefaultValues = getDefaultsForSchema(
  BranchProductResponseSchema
);

// Conversion function to match the response schema
export const convertApiResponseToBranchProduct = (
  apiResponse: any
): BranchProductResponseType => {
  return {
    id: apiResponse.id,
    branch: apiResponse.branch,
    product: apiResponse.product,
    interest: parseFloat(apiResponse.interest),
    max_amount: parseFloat(apiResponse.max_amount),
    min_amount: parseFloat(apiResponse.min_amount),
    period: apiResponse.period,
    min_period: apiResponse.min_period,
    max_period: apiResponse.max_period,
    grace_period_days: apiResponse.grace_period_days,
    allow_half_period: apiResponse.allow_half_period,
    is_active: apiResponse.is_active,
    created_by: apiResponse.created_by,
    created_at: apiResponse.created_at,
    last_modified: apiResponse.last_modified,
  };
};
