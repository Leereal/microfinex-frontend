import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column, ColumnBodyOptions } from "primereact/column";
import { DataTableValueArray } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Button } from "primereact/button";

const LoanTable = ({ loans }: { loans: DataTableValueArray }) => {
  const [expandedRows, setExpandedRows] = useState(null);

  const expandAll = () => {
    let _expandedRows: any = {};

    loans.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const getLoanSeverity = (loan: any) => {
    switch (loan.status) {
      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "danger";

      case "PENDING":
        return "warning";

      case "RETURNED":
        return "info";

      default:
        return null;
    }
  };

  const allowExpansion = (rowData: LoanType) => {
    return rowData.transactions.length > 0;
  };

  const statusBodyTemplate = (rowData: LoanType) => {
    return <Tag value={rowData.status} severity={getLoanSeverity(rowData)} />;
  };

  const amountBodyTemplate = (options: any) => {
    return formatCurrency(options.value);
  };
  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
      <Button
        icon="pi pi-minus"
        label="Collapse All"
        onClick={collapseAll}
        text
      />
    </div>
  );
  const rowExpansionTemplate = (rowData: LoanType) => {
    return (
      <div className="p-3">
        <h5>Transactions for Loan ID {rowData.id}</h5>
        <DataTable value={rowData.transactions}>
          <Column field="id" header="Id" sortable></Column>
          <Column field="description" header="Description" sortable></Column>
          <Column
            field="transaction_type"
            header="Transaction Type"
            sortable
          ></Column>
          <Column
            field="debit"
            header="Debit"
            body={amountBodyTemplate}
            sortable
          ></Column>
          <Column
            field="credit"
            header="Credit"
            body={amountBodyTemplate}
            sortable
          ></Column>
          <Column field="currency" header="Currency" sortable></Column>
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
          ></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <DataTable
      value={loans}
      dataKey="id"
      rowExpansionTemplate={rowExpansionTemplate}
      expandedRows={expandedRows}
      onRowToggle={(e: any) => setExpandedRows(e.data)}
      header={header}
      tableStyle={{ minWidth: "60rem" }}
    >
      <Column expander={allowExpansion} style={{ width: "5rem" }} />
      <Column field="client_full_name" header="Client Name" sortable />
      <Column field="branch_name" header="Branch Name" sortable />
      <Column field="amount" header="Amount" sortable />
      <Column
        field="disbursement_date"
        header="Disbursement Date"
        body={(rowData) => formatDate(rowData.disbursement_date)}
        sortable
      />
      <Column
        field="start_date"
        header="Start Date"
        body={(rowData) => formatDate(rowData.start_date)}
        sortable
      />
      <Column
        field="expected_repayment_date"
        header="Expected Repayment Date"
        body={(rowData) => formatDate(rowData.expected_repayment_date)}
        sortable
      />
      <Column
        field="status"
        header="Status"
        body={statusBodyTemplate}
        sortable
      />
      <Column field="client_full_name" header="Client Full Name" sortable />
      <Column field="loan_created_by" header="Loan Created By" sortable />
      <Column field="loan_approved_by" header="Loan Approved By" sortable />
      <Column field="product_name" header="Product Name" sortable />
    </DataTable>
  );
};

export default LoanTable;
