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
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import {
  TransactionTypeEnum,
  TransactionStatusEnum,
} from "@/schemas/transaction.schema"; // Ensure these enums are imported

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  created_at: {
    operator: "and",
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
  debit: {
    operator: "and",
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  credit: {
    operator: "and",
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  transaction_type: {
    operator: "and",
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  status: {
    operator: "and",
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
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

    if ("value" in _filters["global"]) {
      (_filters["global"] as { value: string }).value = value;
    }

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setGlobalFilterValue("");
    setFilters(defaultFilters);
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

  const [convertedData, setConvertedData] = useState<any[] | null>(null);

  useEffect(() => {
    if (transactions) {
      const convertedTransactions = transactions.map((transaction) => ({
        ...transaction,
        created_at: new Date(transaction.created_at), // Ensure created_at is a Date object
      }));
      setConvertedData(convertedTransactions);
    }
  }, [transactions]);

  const dateFilterTemplate = (options: any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="dd-mm-yy"
        className="p-column-filter"
        placeholder="dd/mm/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const numberFilterTemplate = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.filterCallback(e.value, options.index)}
        mode="decimal"
        className="p-column-filter"
        placeholder="Filter"
      />
    );
  };

  const dropdownFilterTemplate = (options: any, items: any) => {
    return (
      <Dropdown
        value={options.value}
        options={items}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        placeholder="Select a value"
        className="p-column-filter"
      />
    );
  };

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
        value={convertedData!}
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
          filter
          dataType="date"
          filterElement={dateFilterTemplate}
        />
        <Column
          field="client_name"
          header="Client Name"
          sortable
          filter
          className="capitalize"
        />
        <Column
          field="description"
          header="Description"
          sortable
          filter
          className="capitalize"
        />
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
          filter
          filterElement={numberFilterTemplate}
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
          filter
          filterElement={numberFilterTemplate}
        />
        <Column
          field="transaction_type"
          header="Transaction Type"
          sortable
          filter
          filterElement={(options) =>
            dropdownFilterTemplate(
              options,
              Object.values(TransactionTypeEnum).map((type) => ({
                label: type,
                value: type,
              }))
            )
          }
        />
        <Column field="payment_gateway" header="Payment Method" sortable />
        <Column
          field="status"
          header="Status"
          sortable
          body={(rowData) => (
            <TransactionStatusTemplate status={rowData.status} />
          )}
          filter
          filterElement={(options) =>
            dropdownFilterTemplate(
              options,
              Object.values(TransactionStatusEnum).map((status) => ({
                label: status,
                value: status,
              }))
            )
          }
        />
        <Column
          header="Actions"
          body={(rowData) => (
            <div className="flex items-center">
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                className="p-button-rounded p-button-secondary p-button-text"
                onClick={(event) => showMenu(event, rowData)}
              />
              <Menu model={menuItems} popup ref={menuRef} />
            </div>
          )}
        />
      </DataTable>
    </>
  );
};

export default LoanTransactionTable;
