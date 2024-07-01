import { z } from "zod";

export const UploadFileTypeSchema: z.ZodType<UploadFileType> = z.object({
  file: z.any(),
  document_type: z.number(),
  name: z.string(),
});

export const DisbursementTypeSchema = z
  .object({
    client: z.number().min(1, {
      message: "Client is required.",
    }),
    amount: z.number().min(1, {
      message: "Amount is required.",
    }),
    currency: z.number().min(1, {
      message: "Currency is required.",
    }),
    disbursement_date: z.date().refine(
      (value) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value.getTime() === today.getTime();
      },
      {
        message: "Disbursement date must be today",
      }
    ),
    start_date: z.date(),
    expected_repayment_date: z.date().refine(
      (value) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value.getTime() > today.getTime();
      },
      {
        message: "Expected repayment date must be greater than today",
      }
    ),
    branch_product: z.number().min(1, {
      message: "Branch Product is required and must be greater than zero",
    }),
    group_product: z.number().min(1, {
      message: "Group Product is required and must be greater than zero",
    }),
    upload_files: z.array(UploadFileTypeSchema).optional(),
  })
  .refine(
    ({ branch_product, group_product }) => {
      // Either branch_product or group_product must be provided
      return branch_product !== undefined || group_product !== undefined;
    },
    {
      message: "Either Branch Product or Group Product must be provided",
    }
  );
