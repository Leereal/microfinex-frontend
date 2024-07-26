"use client";
import React, { useEffect, useState, useRef } from "react";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { useGetLoansQuery } from "@/redux/features/loanApiSlice";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import AmountTemplate from "@/components/AmountTemplate"; // Import the AmountTemplate component
import LoanStatusTemplate from "@/components/LoanStatusTemplate";
import { ProgressSpinner } from "primereact/progressspinner";
import { formatDate } from "@/utils/helpers";
import { LoanType } from "@/types/common";
import { ContextMenu } from "primereact/contextmenu";
import ChargeLoanModal from "../_components/ChargeLoanModal";
import RefreshButton from "@/components/RefreshButton";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  client_full_name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  disbursement_date: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
  amount: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  balance: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  product_name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  status: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
};

const LoansRegister = () => {
  const [loans, setLoans] = useState<LoanType[]>([]);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [selectedLoans, setSelectedLoans] = useState<LoanType[] | null>(null);
  const [openChargeLoan, setOpenChargeLoan] = useState<boolean>(false);

  const cm = useRef<ContextMenu>(null);

  const defaultColumns = [
    { field: "client_full_name", header: "Client Full Name" },
    { field: "disbursement_date", header: "Disbursement Date" },
    { field: "interest_amount", header: "Interest Amount" },
    { field: "amount", header: "Amount" },
    { field: "balance", header: "Balance" },
    { field: "status", header: "Status" },
  ];

  const columns = [
    ...defaultColumns,
    { field: "product_name", header: "Product Name" },
    { field: "branch_name", header: "Branch Name" },
    { field: "start_date", header: "Start Date" },
    { field: "interest_rate", header: "Interest Rate" },
    { field: "expected_repayment_date", header: "Expected Repayment Date" },
    { field: "loan_created_by", header: "Loan Created By" },
    { field: "loan_approved_by", header: "Loan Approved By" },
  ];
  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const hasSameCurrency = (loans: LoanType[]): boolean => {
    if (loans.length === 0) return false;
    const currency = loans[0].currency;
    return loans.every((loan) => loan.currency === currency);
  };

  const menuModel = [
    {
      label: "Charge Loan",
      icon: "pi pi-fw pi-dollar",
      command: () => chargeLoan(selectedLoans),
      visible: selectedLoans ? hasSameCurrency(selectedLoans) : false,
    },
    {
      label: "Move Loan",
      icon: "pi pi-fw pi-file-import",
      command: () => moveLoan(selectedLoans),
    },
  ];

  const onColumnToggle = (event: MultiSelectChangeEvent) => {
    const selectedColumns = event.value;
    const orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some(
        (sCol: { field: string }) => sCol.field === col.field
      )
    );
    setVisibleColumns(orderedSelectedColumns);
  };

  const {
    data: loansData,
    isLoading: loansLoading,
    refetch,
  } = useGetLoansQuery();

  useEffect(() => {
    if (loansData) {
      const convertedLoans = loansData.map((loan) => ({
        ...loan,
        disbursement_date: new Date(loan.disbursement_date), // Ensure created_at is a Date object
        expected_repayment_date: new Date(loan.expected_repayment_date),
        start_date: new Date(loan.start_date),
      }));
      setLoans(convertedLoans);
    }
    initFilters();
  }, [loansData]);

  const chargeLoan = (selectedLoans: LoanType[] | null) => {
    if (selectedLoans) {
      setOpenChargeLoan(true);
    }
  };

  const moveLoan = (selectedLoans: LoanType[] | null) => {
    // Handle loan moving logic
  };

  const clearFilter = () => {
    initFilters();
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
    setFilters(defaultFilters);
    setGlobalFilterValue("");
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between items-center">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
        />
        <MultiSelect
          value={visibleColumns}
          options={columns}
          optionLabel="header"
          onChange={onColumnToggle}
          className="w-full sm:w-20rem"
          display="chip"
        />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

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

  const loader = () => {
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
  };

  return (
    <>
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <div className="flex justify-between">
              {" "}
              <h3 className="font-bold text-primary-700">Loans List</h3>{" "}
              <RefreshButton onRefresh={refetch} />
            </div>
            {loansLoading ? (
              loader()
            ) : (
              <>
                {selectedLoans && !!selectedLoans.length && (
                  <ContextMenu model={menuModel} ref={cm} />
                )}
                <DataTable
                  value={loans}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  filters={filters}
                  globalFilterFields={[
                    "client_full_name",
                    "amount",
                    "product_name",
                    "balance",
                    "disbursement_date",
                  ]}
                  header={header}
                  resizableColumns
                  columnResizeMode="expand"
                  dataKey="id"
                  selection={selectedLoans}
                  onSelectionChange={(e: any) => setSelectedLoans(e.value)}
                  onContextMenu={(e) => cm.current?.show(e.originalEvent)}
                  scrollable
                  scrollHeight="flex"
                  paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} loans"
                >
                  <Column
                    selectionMode="multiple"
                    exportable={false}
                    style={{ width: "3em" }}
                  ></Column>
                  {visibleColumns.map((col, i) => {
                    const { field, header } = col;
                    return (
                      <Column
                        key={field}
                        field={field}
                        header={header}
                        dataType={
                          col.field === "disbursement_date" ||
                          col.field === "start_date" ||
                          col.field === "expected_repayment_date"
                            ? "date"
                            : ""
                        }
                        body={
                          col.field === "amount" ||
                          col.field === "balance" ||
                          col.field === "interest_amount"
                            ? (rowData) => (
                                <AmountTemplate
                                  amount={rowData[col.field]}
                                  currencyId={rowData.currency}
                                />
                              )
                            : col.field === "status"
                            ? (rowData) => (
                                <LoanStatusTemplate
                                  status={rowData[col.field]}
                                />
                              )
                            : col.field === "disbursement_date" ||
                              col.field === "start_date" ||
                              col.field === "expected_repayment_date"
                            ? (rowData) => formatDate(rowData[col.field])
                            : undefined
                        }
                        filter
                        filterElement={
                          field === "disbursement_date" ||
                          field === "start_date" ||
                          field === "expected_repayment_date"
                            ? dateFilterTemplate
                            : undefined
                        }
                        filterField={
                          field === "disbursement_date"
                            ? "disbursement_date"
                            : field
                        }
                        showFilterMatchModes={false}
                        style={{ minWidth: "12rem" }}
                      />
                    );
                  })}
                </DataTable>
              </>
            )}
          </div>
        </div>
      </div>
      {selectedLoans && !!selectedLoans.length && openChargeLoan && (
        <ChargeLoanModal
          visible={openChargeLoan}
          onHide={() => setOpenChargeLoan(false)}
          selectedLoans={selectedLoans}
          showError={() => {}}
          showSuccess={() => {}}
        />
      )}
    </>
  );
};
export default LoansRegister;
