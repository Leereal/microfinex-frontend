import React, { useEffect, useRef, useState } from "react";
import {
  DataTable,
  DataTableFilterMeta,
  DataTableFilterMetaData,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { TransactionType } from "@/types/common";
import { useGetRepaymentsQuery } from "@/redux/features/loanApiSlice";
import ReceiptModal from "@/components/templates/receipt";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { CurrencyType } from "@/schemas/currency.schema";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/helpers";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import PaymentReceipt from "@/components/templates/payment-receipt";
import LoanStatusTemplate from "@/components/LoanStatusTemplate";
import TransactionStatusTemplate from "@/components/TransactionStatusTemplate";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //Add individual column filters here if needed
};

const RepaymentTable: React.FC<{ showError: any }> = ({ showError }) => {
  const [expandedRows, setExpandedRows] = useState<any>({});
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const {
    data: repayments,
    isError: isRepaymentsError,
    isLoading,
  } = useGetRepaymentsQuery();
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const menuRef = useRef<Menu>(null);
  const dt = useRef<DataTable<TransactionType[]> | null>(null);

  const {
    data: currencies,
    isError: isCurrenciesError,
    isLoading: isCurrenciesLoading,
  } = useGetCurrenciesQuery();

  const menuItems: MenuItem[] = [
    {
      label: "Receipt",
      icon: "pi pi-print",
      command: () => handlePrintReceipt(),
    },
  ];

  const handlePrintReceipt = () => {
    setIsReceiptModalVisible(true);
  };

  const showMenu = (event: React.MouseEvent, rowData: TransactionType) => {
    menuRef.current?.toggle(event);
    setReceiptData(rowData);
  };

  const statusBodyTemplate = (rowData: TransactionType) => (
    <Tag
      value={rowData.status}
      severity={getTransactionSeverity(rowData)}
      className="capitalize"
    />
  );

  const getTransactionSeverity = (transaction: TransactionType) => {
    switch (transaction.status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "cancelled":
      case "refunded":
        return "danger";
      default:
        return null;
    }
  };

  // const rowExpansionTemplate = (rowData: TransactionType) => (
  //   <div className="p-3">
  //     <h5>Details for Transaction ID {rowData.id}</h5>
  //     <p>Description: {rowData.description}</p>
  //     <p>Loan ID: {rowData.loan}</p>
  //     <p>Client Name: {rowData.client_name}</p>
  //     <p>Debit: {rowData.debit}</p>
  //     <p>Credit: {rowData.credit}</p>
  //   </div>
  // );

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
    { title: "Credit", dataKey: "credit" },
    { title: "Payment Method", dataKey: "payment_gateway" },
    { title: "Status", dataKey: "status" },
  ];

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();
        const headers = exportColumns.map((col) => col.title);
        const body = repayments?.map((repayment: any) =>
          exportColumns.map((col) => repayment[col.dataKey])
        );

        (doc as any).autoTable({
          head: [headers],
          body: body,
        });

        doc.save("repayments.pdf");
      });
    });
  };
  const exportCSV = (selectionOnly: boolean) => {
    dt.current?.exportCSV({ selectionOnly });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(repayments || []);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "repayments");
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
    if (isRepaymentsError) {
      showError("Error fetching repayments");
    }
  }, [isRepaymentsError, showError]);
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
        value={repayments}
        dataKey="id"
        // rowExpansionTemplate={rowExpansionTemplate}
        expandedRows={expandedRows}
        // onRowToggle={(e) => setExpandedRows(e.data)}
        header={renderHeader}
        filters={filters}
        globalFilterFields={[
          "client_name",
          "credit",
          "payment_gateway",
          "status",
        ]}
      >
        {/* <Column expander style={{ width: "5rem" }} />     */}
        <Column
          field="created_at"
          header="Date"
          body={(rowData: TransactionType) => {
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
          body={amountBodyTemplate}
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
          body={(rowData) => (
            <TransactionStatusTemplate status={rowData.status} />
          )}
          sortable
        />
        <Column
          header="Actions"
          body={(rowData) => (
            <div className="text-center">
              <Button
                icon="pi pi-ellipsis-v"
                onClick={(event) => showMenu(event, rowData)}
                className="p-button-text p-button-rounded p-button-outlined"
              />
              <Menu
                model={menuItems}
                popup
                ref={menuRef}
                id={`menu_${rowData.id}`}
              />
            </div>
          )}
        />
      </DataTable>
      {receiptData && isReceiptModalVisible && (
        <PaymentReceipt
          visible={isReceiptModalVisible}
          onHide={() => setIsReceiptModalVisible(false)}
          paymentData={receiptData}
        />
      )}
    </>
  );
};

export default RepaymentTable;
