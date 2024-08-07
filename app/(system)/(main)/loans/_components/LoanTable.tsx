import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { formatDate } from "@/utils/helpers";
import { LoanType } from "@/types/common";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { ProgressSpinner } from "primereact/progressspinner";
import { useGetLoansQuery } from "@/redux/features/loanApiSlice";
import ReceiptModal from "@/components/templates/receipt";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRouter } from "next/navigation";
import RefreshButton from "@/components/RefreshButton";
import LoanStatusTemplate from "@/components/LoanStatusTemplate";
import TransactionStatusTemplate from "@/components/TransactionStatusTemplate";
import AmountTemplate from "@/components/AmountTemplate"; // Import the new AmountTemplate component

interface Props {
  showError: any;
}

const LoanTable: React.FC<Props> = ({ showError }: Props) => {
  const [expandedRows, setExpandedRows] = useState<any>({});
  const {
    data: loans,
    isError: isLoansError,
    isLoading,
    refetch,
  } = useGetLoansQuery();
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const menuRef = useRef<Menu>(null);
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      label: "Receipt",
      icon: "pi pi-print",
      command: () => handlePrintReceipt(),
    },
    {
      label: "View Statement",
      icon: "pi pi-eye",
      command: () => handleViewStatement(),
    },
  ];
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
    { field: "balance", header: "Balance" },
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

  const handlePrintReceipt = () => {
    setIsReceiptModalVisible(true);
  };

  const handleViewStatement = () => {
    if (receiptData) {
      router.push(`/loans/${receiptData.id}`);
    }
  };
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

  const allowExpansion = (rowData: LoanType) => {
    return rowData.transactions.length > 0;
  };

  const menuTemplate = (rowData: LoanType) => {
    return (
      <div className="text-center">
        <Button
          icon="pi pi-ellipsis-v"
          onClick={(event) => showMenu(event, rowData)}
          className="p-button-text p-button-rounded p-button-outlined"
        />
        <Menu model={menuItems} popup ref={menuRef} id={`menu_${rowData.id}`} />
      </div>
    );
  };

  const showMenu = (event: React.MouseEvent, rowData: LoanType) => {
    menuRef.current?.toggle(event);
    // Optionally, you can set rowData or perform any other action based on the selected row
    setReceiptData(rowData); // Set receiptData for the receipt modal
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
          body={(rowData) => (
            <AmountTemplate
              amount={rowData.debit}
              currencyId={rowData.currency}
            />
          )}
          sortable
        />
        <Column
          field="credit"
          header="Credit"
          body={(rowData) => (
            <AmountTemplate
              amount={rowData.credit}
              currencyId={rowData.currency}
            />
          )}
          sortable
        />
        <Column
          field="status"
          header="Status"
          body={(rowData) => (
            <TransactionStatusTemplate status={rowData.status} />
          )}
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
    <>
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
            <div className="flex gap-2 items-center">
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
              <RefreshButton onRefresh={() => refetch()} label="Refresh" />
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
              col.field === "amount" || col.field === "balance"
                ? (rowData) => (
                    <AmountTemplate
                      amount={rowData[col.field]}
                      currencyId={rowData.currency}
                    />
                  )
                : col.field === "status"
                ? (rowData) => (
                    <LoanStatusTemplate status={rowData[col.field]} />
                  )
                : col.field === "disbursement_date" ||
                  col.field === "start_date" ||
                  col.field === "expected_repayment_date"
                ? (rowData) => formatDate(rowData[col.field])
                : undefined
            }
          />
        ))}
        <Column key="action" header="Actions" body={menuTemplate} />
      </DataTable>
      {receiptData && isReceiptModalVisible && (
        <ReceiptModal
          visible={isReceiptModalVisible}
          onHide={() => setIsReceiptModalVisible(false)}
          receiptData={receiptData}
        />
      )}
    </>
  );
};

export default LoanTable;
