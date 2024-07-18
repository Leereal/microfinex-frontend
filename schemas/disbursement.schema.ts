import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

// Define the UploadFileSchema
export const UploadFileSchema = z.object({
  file: z.instanceof(File).optional(),
  document_type: z.number(),
  name: z.string(),
});

export type UploadFileType = z.infer<typeof UploadFileSchema>;

// Define the DisbursementSchema
export const DisbursementSchema = z.object({
  client: z.number(),
  amount: z.number(),
  currency: z.number(),
  payment_gateway: z.number(),
  disbursement_date: z.date().nullable().default(new Date()), // Set default to today's date
  start_date: z.date(),
  expected_repayment_date: z.date(),
  branch_product: z.number().optional().nullable().default(null),
  // group_product: z.number().optional().nullable().default(null).optional(),
  upload_files: z.array(UploadFileSchema).optional().default([]),
});

export type DisbursementType = z.infer<typeof DisbursementSchema>;

export const disbursementDefaultValues =
  getDefaultsForSchema(DisbursementSchema);
