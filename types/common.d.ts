interface TimeStampedModel {
  created_at: Date;
  last_modified: Date;
  deleted_at: Date | null;
}

interface BranchType {
  id?: number | null | undefined;
  name: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  is_active?: boolean;
}

interface CurrencyType {
  id?: number | null | undefined;
  name: string;
  symbol: string;
  position: "before" | "after";
  is_active?: boolean;
}

interface ProductType {
  id?: number | null | undefined;
  name: string;
  is_active?: boolean;
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

interface DisbursementType {
  client: number;
  amount: number;
  currency: number;
  disbursement_date: Date;
  start_date: Date;
  expected_repayment_date: Date;
  branch_product: number;
  upload_files?: UploadFileType[];
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

interface DocumentType {
  id: number;
  client?: number | null;
  loan?: number | null;
  name: string;
  file: string;
  document_type?: number | null;
  branch?: number | null;
}
