import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { LoanType } from "@/types/common";
import { CurrencyType } from "@/schemas/currency.schema";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { ProgressSpinner } from "primereact/progressspinner";
import { useGetLoansQuery } from "@/redux/features/loanApiSlice";

interface Props {
  loans: LoanType[];
  showError: any;
}

const LoanTable: React.FC<Props> = ({ showError }: Props) => {
  const [expandedRows, setExpandedRows] = useState<any>({});
  const { data: loans, isError: isLoansError, isLoading } = useGetLoansQuery();

  const {
    data: currencies,
    isError: isCurrenciesError,
    isLoading: isCurrenciesLoading,
  } = useGetCurrenciesQuery();

  const defaultColumns = [
    { field: "client_full_name", header: "Client Full Name" },
    { field: "branch_name", header: "Branch Name" },
    { field: "disbursement_date", header: "Disbursement Date" },
    { field: "amount", header: "Amount" },
    { field: "product_name", header: "Product Name" },
    { field: "status", header: "Status" },
  ];

  const columns = [
    ...defaultColumns,
    { field: "start_date", header: "Start Date" },
    { field: "expected_repayment_date", header: "Expected Repayment Date" },
    { field: "loan_created_by", header: "Loan Created By" },
    { field: "loan_approved_by", header: "Loan Approved By" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);

  const onColumnToggle = (event: MultiSelectChangeEvent) => {
    setVisibleColumns(event.value);
  };

  const expandAll = () => {
    const expandedRows: any = {};
    loans?.forEach((loan) => {
      expandedRows[loan.id] = true;
    });
    setExpandedRows(expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows({});
  };
  const getLoanSeverity = (loan: LoanType) => {
    switch (loan.status) {
      case "Pending":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "danger";
      case "Active":
        return "success";
      case "Default":
        return "danger";
      case "Completed":
        return "info";
      case "Overdue":
        return "danger";
      case "Cancelled":
        return "danger";
      case "Failed":
        return "danger";
      case "Closed":
        return "info";
      case "Legal":
        return "danger";
      case "Bad Debt":
        return "danger";
      default:
        return null;
    }
  };
  const allowExpansion = (rowData: LoanType) => {
    return rowData.transactions.length > 0;
  };

  const statusBodyTemplate = (rowData: LoanType) => (
    <Tag value={rowData.status} severity={getLoanSeverity(rowData)} />
  );

  const amountBodyTemplate = (rowData: any, options: any) => {
    const currency =
      currencies?.find(
        (curr: CurrencyType) =>
          curr.id === rowData.currency || curr.code === rowData.currency
      ) || null;
    return rowData[options.field]
      ? formatCurrency(rowData[options.field], currency)
      : null;
  };

  const rowExpansionTemplate = (rowData: LoanType) => (
    <div className="p-3">
      <h5>Transactions for Loan ID {rowData.id}</h5>
      <DataTable value={rowData.transactions}>
        <Column field="id" header="Id" sortable />
        <Column field="description" header="Description" sortable />
        <Column field="transaction_type" header="Transaction Type" sortable />
        <Column
          field="debit"
          header="Debit"
          body={amountBodyTemplate}
          sortable
        />
        <Column
          field="credit"
          header="Credit"
          body={amountBodyTemplate}
          sortable
        />
        <Column field="currency" header="Currency" sortable />
        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          sortable
        />
      </DataTable>
    </div>
  );
  useEffect(() => {
    if (isLoansError) {
      showError("Error fetching loans");
    }
  }, [isLoansError, showError]);

  if (isLoading) {
    return (
      <div className="card flex justify-center">
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </div>
    );
  }
  return (
    <DataTable
      value={loans}
      dataKey="id"
      rowExpansionTemplate={rowExpansionTemplate}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      header={
        <div className="flex justify-between items-center">
          <MultiSelect
            value={visibleColumns}
            options={columns}
            optionLabel="header"
            onChange={onColumnToggle}
            className="w-full sm:w-20rem mb-3"
            display="chip"
          />
          <div className="flex gap-2">
            <Button
              icon="pi pi-plus"
              label="Expand All"
              onClick={expandAll}
              text
            />
            <Button
              icon="pi pi-minus"
              label="Collapse All"
              onClick={collapseAll}
              text
            />
          </div>
        </div>
      }
    >
      <Column expander={allowExpansion} style={{ width: "5rem" }} />
      {visibleColumns.map((col) => (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          sortable
          body={
            col.field === "amount"
              ? amountBodyTemplate
              : col.field === "status"
              ? statusBodyTemplate
              : col.field === "disbursement_date" ||
                col.field === "start_date" ||
                col.field === "expected_repayment_date"
              ? (rowData: any) => formatDate(rowData[col.field])
              : undefined
          }
        />
      ))}
    </DataTable>
  );
};

export default LoanTable;
