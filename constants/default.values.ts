export const branchDefaultValues: BranchType = {
  id: undefined,
  name: "",
  address: "",
  email: "",
  phone: "",
  is_active: true,
};

export const disbursementDefaultValues: DisbursementType = {
  client: 0,
  amount: 0,
  currency: 0,
  disbursement_date: new Date(),
  start_date: new Date(),
  expected_repayment_date: new Date(),
  branch_product: 0,
  upload_files: [],
};
