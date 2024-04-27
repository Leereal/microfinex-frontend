interface AuditChangeType extends TimeStampedModel {
  user: User | null;
  model_name: string;
  record_id: number;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  action: string | null;
}

interface BranchAssetType extends TimeStampedModel {
  id?: number | null | undefined;
  branch: number | null;
  item: string;
  description: string | null;
  brand: string | null;
  color: string | null;
  quantity: number;
  user: number | null;
  usedBy: number | null;
  purchaseDate: Date | null;
  images: String[] | null;
}

interface BranchProductType {
  id?: number | null | undefined;
  branch: BranchType;
  product: ProductType;
  interest: number;
  max_amount: number;
  min_amount: number;
  period: PeriodType;
  min_period: number;
  max_period: number;
  is_active: boolean;
  created_by: UserType;
}

interface BranchType {
  id?: number | null | undefined;
  name: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  is_active?: boolean;
}

interface ClientType {
  id: number;
  contacts: ContactType[];
  country: string | null;
  passport_country: string | null;
  next_of_kin: NextOfKinType | null;
  employer: EmployerType | null;
  client_limit: number | null;
  created_at: string;
  last_modified: string;
  deleted_at: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  emails: string[];
  national_id: string | null;
  nationality: string | null;
  passport_number: string | null;
  photo: string | null;
  date_of_birth: string;
  title: string | null;
  gender: string;
  street_number: string | null;
  suburb: string | null;
  zip_code: string | null;
  city: string | null;
  state: string | null;
  guarantor: ClientType | null;
  is_guarantor: boolean;
  status: string;
  is_active: boolean;
  ip_address: string | null;
  device_details: string | null;
  created_by: number | null;
  branch: number;
  age: number;
}

interface CurrencyType {
  id?: number | null | undefined;
  name: string;
  symbol: string;
  position: "before" | "after";
  is_active?: boolean;
}
interface DashboardSummary {
  total_clients: number;
  total_disbursements: number;
  total_payments: number;
  total_disbursements_amount: number;
  total_payments_amount: number;
  total_loans_processed: number;
  recent_loans: LoanType[];
  new_clients_this_week: number;
  percentage_increase_disbursements: number;
  last_week_transactions_with_credit: number;
  rejected_loans_count: number;
  available_funds: number;
}
interface DisbursementType {
  client: number;
  amount: number;
  currency: number;
  disbursement_date: Date;
  start_date: Date;
  expected_repayment_date: Date;
  branch_product?: number;
  group_product?: number;
  upload_files?: UploadFileType[];
}

interface DocumentType {
  id: number;
  client?: number | null;
  loan?: number | null;
  name: string;
  file: string;
  document_type?: number | null;
  branch?: number | null;
}

interface TimeStampedModel {
  created_at: Date;
  last_modified: Date;
  deleted_at: Date | null;
}

interface ProductType {
  id?: number | null | undefined;
  name: string;
  is_active?: boolean;
}

interface UploadFileType {
  file?: File;
  document_type: number;
  name: string;
}

interface LoanType {
  id: number;
  client: number;
  client_full_name: string;
  branch: number;
  branch_name: string;
  created_by: number;
  loan_created_by: string;
  approved_by: number | null;
  loan_approved_by: string | null;
  amount: string;
  interest_rate: string | null;
  interest_amount: string | null;
  currency: number;
  loan_application: number | null;
  disbursement_date: Date;
  start_date: Date;
  expected_repayment_date: Date;
  status: number;
  product_name: string;
  branch_product: number | null;
  group_product: number | null;
  transactions: TransactionType[];
  documents: DocumentType[];
}

interface TransactionType {
  id: number;
  loan: number;
  client_name: string;
  description: string;
  transaction_type:
    | "disbursement"
    | "repayment"
    | "interest"
    | "charge"
    | "refund"
    | "bonus"
    | "topup";
  debit: string | null;
  credit: string | null;
  currency: string;
  branch: string;
  status: "review" | "pending" | "approved" | "cancelled" | "refunded";
}

interface ContactType {
  id: number;
  client: number;
  phone: string;
  type: string;
  is_primary: boolean;
  is_active: boolean;
  whatsapp: boolean;
  country_code: number;
}

interface NextOfKinType {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  address: string | null;
  created_by: number | null;
  is_active: boolean;
}

interface EmployerType {
  id: number;
  contact_person: string;
  email: string;
  phone: string;
  name: string;
  address: string;
  employment_date: string;
  job_title: string;
  created_by: number;
  is_active: boolean;
}

interface ContactPayload {
  phone: string;
  type: string;
  is_primary: boolean;
  whatsapp: boolean;
}

interface NextOfKinPayload {
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  relationship?: string | null;
  address?: string | null;
}

interface EmployerPayload {
  contact_person?: string | null;
  email?: string | null;
  phone: string | null;
  name: string;
  address: string | null;
  employment_date?: string | null;
  job_title?: string | null;
}

interface ClientLimitPayload {
  max_loan: string;
  credit_score: string;
  currency: number;
}

interface ClientPayload {
  contacts: ContactPayload[];
  country: string;
  passport_country?: string | null;
  next_of_kin?: NextOfKinPayload;
  employer?: EmployerPayload;
  client_limit: ClientLimitPayload;
  first_name: string;
  last_name: string;
  emails?: string[];
  national_id?: string;
  nationality?: string | null;
  date_of_birth: Date;
  title: string;
  gender: string;
  street_number: string | null;
  suburb: string | null;
  zip_code: string | null;
  city: string | null;
  state: string | null;
  guarantor?: number | null;
  is_guarantor: boolean;
}
