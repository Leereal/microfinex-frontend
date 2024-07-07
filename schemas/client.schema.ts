import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

export const ContactSchema = z.object({
  id: z.number().optional().nullable().default(null),
  client: z.number(),
  phone: z.string(),
  type: z.string(),
  is_primary: z.boolean(),
  whatsapp: z.boolean(),
  country_code: z.number().nullable().default(null),
});

export const NextOfKinSchema = z
  .object({
    id: z.number().optional().nullable().default(null),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().nullable().default(null),
    phone: z.string().nullable().default(null),
    relationship: z.string().nullable().default(null),
    address: z.string().nullable().default(null),
    created_by: z.number().nullable().default(null),
    is_active: z.boolean(),
  })
  .nullable()
  .default({
    id: undefined,
    first_name: "",
    last_name: "",
    email: null,
    phone: null,
    relationship: null,
    address: null,
    created_by: null,
    is_active: true,
  });

export const EmployerSchema = z
  .object({
    id: z.number().optional().nullable().default(null),
    contact_person: z.string(),
    email: z.string(),
    phone: z.string(),
    name: z.string(),
    address: z.string(),
    employment_date: z.string().nullable().default(null),
    job_title: z.string().nullable().default(null),
    created_by: z.number().nullable().default(null),
    is_active: z.boolean(),
  })
  .nullable()
  .default({
    id: undefined,
    contact_person: "",
    email: "",
    phone: "",
    name: "",
    address: "",
    employment_date: null,
    job_title: null,
    created_by: null,
    is_active: true,
  });

export const ClientLimitSchema = z.object({
  id: z.number().optional().nullable().default(null),
  max_loan: z.number().nullable().default(null),
  credit_score: z.string(),
  currency: z.number(),
});

export const ClientSchema = z.object({
  id: z.number().optional().nullable().default(null),
  contacts: z.array(ContactSchema).default([]),
  country: z.string().nullable().default(null),
  passport_country: z.string().nullable().default(null),
  next_of_kin: NextOfKinSchema,
  employer: EmployerSchema,
  client_limit: ClientLimitSchema.default({
    id: undefined,
    max_loan: null,
    credit_score: "",
    currency: 0,
  }),
  created_at: z.string(),
  last_modified: z.string(),
  deleted_at: z.string().nullable().default(null),
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string().nullable().default(null),
  emails: z.array(z.string()).default([]),
  national_id: z.string().nullable().default(null),
  nationality: z.string().nullable().default(null),
  passport_number: z.string().nullable().default(null),
  photo: z.string().nullable().default(null),
  date_of_birth: z.string(),
  title: z.string().nullable().default(null),
  gender: z.string(),
  street_number: z.string().nullable().default(null),
  suburb: z.string().nullable().default(null),
  zip_code: z.string().nullable().default(null),
  city: z.string().nullable().default(null),
  state: z.string().nullable().default(null),
  guarantor: z.number().nullable().default(null),
  is_guarantor: z.boolean(),
  status: z.string(),
  is_active: z.boolean(),
  ip_address: z.string().nullable().default(null),
  device_details: z.string().nullable().default(null),
  created_by: z.number().nullable().default(null),
  branch: z.number(),
  age: z.number(),
});

export type ClientType = z.infer<typeof ClientSchema>;

export const clientDefaultValues = getDefaultsForSchema(ClientSchema);
