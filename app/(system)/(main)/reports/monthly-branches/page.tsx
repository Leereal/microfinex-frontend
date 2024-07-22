"use client";
import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useGetMonthlyBranchReportQuery } from "@/redux/features/reportsApiSlice";

interface BranchReport {
  branch: string;
  current_month_disbursements: number;
  current_month_repayments: number;
  last_month_disbursements: number;
  last_month_repayments: number;
}

export default function MonthlyBranchReport() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM format

  const {
    data: reportData,
    error: reportError,
    isLoading: isReportLoading,
    refetch: refetchMonthlyBranchReport,
  } = useGetMonthlyBranchReportQuery({ month: selectedMonth });

  const currencyFormatter = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const calculateTotals = (field: keyof BranchReport) => {
    return (
      reportData?.reduce(
        (total: number, item: BranchReport) => total + item[field],
        0
      ) || 0
    );
  };

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Branch" rowSpan={2} />
        <Column header="Current Month" colSpan={2} />
        <Column header="Last Month" colSpan={2} />
      </Row>
      <Row>
        <Column header="Disbursements" />
        <Column header="Repayments" />
        <Column header="Disbursements" />
        <Column header="Repayments" />
      </Row>
    </ColumnGroup>
  );

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Totals:" />
        <Column
          footer={currencyFormatter(
            calculateTotals("current_month_disbursements")
          )}
        />
        <Column
          footer={currencyFormatter(
            calculateTotals("current_month_repayments")
          )}
        />
        <Column
          footer={currencyFormatter(
            calculateTotals("last_month_disbursements")
          )}
        />
        <Column
          footer={currencyFormatter(calculateTotals("last_month_repayments"))}
        />
      </Row>
    </ColumnGroup>
  );

  if (isReportLoading) {
    return <div>Loading...</div>;
  }

  if (reportError) {
    return <div>Error loading report data</div>;
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-primary-700">Monthly Branchesw Report</h3>
        {/* <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-inputtext p-component"
        />
        <button onClick={() => refetchMonthlyBranchReport()}>Refresh</button> */}
      </div>
      <DataTable
        value={reportData}
        headerColumnGroup={headerGroup}
        footerColumnGroup={footerGroup}
      >
        <Column field="branch" header="Branch" />
        <Column
          field="current_month_disbursements"
          header="Current Month Disbursements"
          body={(data) => currencyFormatter(data.current_month_disbursements)}
        />
        <Column
          field="current_month_repayments"
          header="Current Month Repayments"
          body={(data) => currencyFormatter(data.current_month_repayments)}
        />
        <Column
          field="last_month_disbursements"
          header="Last Month Disbursements"
          body={(data) => currencyFormatter(data.last_month_disbursements)}
        />
        <Column
          field="last_month_repayments"
          header="Last Month Repayments"
          body={(data) => currencyFormatter(data.last_month_repayments)}
        />
      </DataTable>
    </div>
  );
}
