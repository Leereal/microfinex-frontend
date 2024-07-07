import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

export const CurrencySchema = z.object({
  id: z.number().optional().nullable().default(null),
  name: z.string(),
  symbol: z.string(),
  code: z.string(),
  position: z.enum(["before", "after"]),
  is_active: z.boolean().default(true),
});

export type CurrencyType = z.infer<typeof CurrencySchema>;

export const currencyDefaultValues = getDefaultsForSchema(CurrencySchema);
