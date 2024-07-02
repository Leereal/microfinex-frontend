import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";
// export const BranchSchema: z.ZodType<BranchType> = z.object({ // No nned for types since zod is handling this. If any error uncomment and use this.
//This is to avoid defining the BranchSchema twice

export const BranchSchema = z.object({
  id: z.number().optional().nullable().default(null),
  name: z
    .string()
    .min(2, {
      message: "Name is required and should be at least 2 characters long",
    })
    .default(""),
  address: z.string().optional().default(""),
  email: z
    .union([
      z.literal(""),
      z.string().email({ message: "Invalid email address" }),
    ])
    .default(""),
  phone: z.string().optional().default(""),
  is_active: z.boolean().optional().default(true),
});

export type BranchType = z.infer<typeof BranchSchema>;

export const branchDefaultValues = getDefaultsForSchema(BranchSchema);
