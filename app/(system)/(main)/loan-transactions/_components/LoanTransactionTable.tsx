"use client";
import React, { useEffect, useRef, useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { formatDateTime } from "@/utils/helpers";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { LoanTransactionType } from "@/schemas/transaction.schema";
import { useGetTransactionsQuery } from "@/redux/features/transactionApiSlice";
import AmountTemplate from "@/components/AmountTemplate";
import TransactionStatusTemplate from "@/components/TransactionStatusTemplate";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  // Add individual column filters here if needed
};

const LoanTransactionTable: React.FC<{ showError: any }> = ({ showError }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const {
    data: transactions,
    isError: isTransactionsError,
    isLoading,
  } = useGetTransactionsQuery(); // Adjust the query hook
  const menuRef = useRef<Menu>(null);
  const dt = useRef<DataTable<LoanTransactionType[]> | null>(null);

  const menuItems: MenuItem[] = [
    {
      label: "View",
      icon: "pi pi-eye",
      // command: () => handlePrintReceipt(),
    },
  ];

  const showMenu = (event: React.MouseEvent, rowData: LoanTransactionType) => {
    menuRef.current?.toggle(event);
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setGlobalFilterValue("");
  };

  const exportColumns = [
    { title: "Date", dataKey: "created_at" },
    { title: "Client Name", dataKey: "client_name" },
    { title: "Description", dataKey: "description" },
    { title: "Debit", dataKey: "debit" },
    { title: "Credit", dataKey: "credit" },
    { title: "Transaction Type", dataKey: "transaction_type" },
    { title: "Payment Method", dataKey: "payment_gateway" },
    { title: "Status", dataKey: "status" },
  ];

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();
        const headers = exportColumns.map((col) => col.title);
        const body = transactions?.map((transaction: any) =>
          exportColumns.map((col) => transaction[col.dataKey])
        );

        (doc as any).autoTable({
          head: [headers],
          body: body,
        });

        doc.save("transactions.pdf");
      });
    });
  };

  const exportCSV = (selectionOnly: boolean) => {
    dt.current?.exportCSV({ selectionOnly });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(transactions || []);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "transactions");
    });
  };

  const saveAsExcelFile = (buffer: any, fileName: any) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
        );
      }
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <div className="flex justify-content-start">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </IconField>
        </div>
        <div className="flex align-items-center justify-content-end gap-2">
          <Button
            type="button"
            icon="pi pi-file"
            rounded
            onClick={() => exportCSV(false)}
            data-pr-tooltip="CSV"
          />
          <Button
            type="button"
            icon="pi pi-file-excel"
            severity="success"
            rounded
            onClick={exportExcel}
            data-pr-tooltip="XLS"
          />
          <Button
            type="button"
            icon="pi pi-file-pdf"
            severity="warning"
            rounded
            onClick={exportPdf}
            data-pr-tooltip="PDF"
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isTransactionsError) {
      showError("Error fetching transactions");
    }
  }, [isTransactionsError, showError]);
  useEffect(() => {
    initFilters();
  }, []);

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
        value={transactions}
        dataKey="id"
        header={renderHeader}
        filters={filters}
        globalFilterFields={[
          "client_name",
          "credit",
          "payment_gateway",
          "status",
        ]}
      >
        <Column
          field="created_at"
          header="Date"
          body={(rowData) => {
            return <span>{formatDateTime(rowData.created_at)}</span>;
          }}
          sortable
        />
        <Column
          field="client_name"
          header="Client Name"
          sortable
          className="capitalize"
        />
        <Column
          field="description"
          header="Description"
          sortable
          className="capitalize"
        />
        <Column
          field="credit"
          header="Credit"
          sortable
          body={(rowData) => (
            <AmountTemplate
              amount={rowData.credit}
              currencyId={rowData.currency}
            />
          )}
        />
        <Column
          field="debit"
          header="Debit"
          sortable
          body={(rowData) => (
            <AmountTemplate
              amount={rowData.debit}
              currencyId={rowData.currency}
            />
          )}
        />
        <Column
          field="transaction_type"
          header="Transaction Type"
          sortable
          className="capitalize"
        />
        <Column
          field="payment_gateway"
          header="Payment Method"
          sortable
          className="capitalize"
        />
        <Column
          field="status"
          header="Status"
          sortable
          body={(rowData) => (
            <TransactionStatusTemplate status={rowData.status} />
          )}
        />
        <Column
          body={(rowData) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-ellipsis-v"
                className="p-button-rounded p-button-info"
                onClick={(e) => showMenu(e, rowData)}
              />
              <Menu model={menuItems} popup ref={menuRef} id="popup_menu" />
            </div>
          )}
        />
      </DataTable>
    </>
  );
};

export default LoanTransactionTable;
