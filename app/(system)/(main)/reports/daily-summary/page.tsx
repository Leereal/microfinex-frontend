"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { useGetDailySummaryQuery } from "@/redux/features/reportsApiSlice";
import ErrorComponent from "@/components/ErrorMessage";
import { formatCurrency, formatDateTime } from "@/utils/helpers";
import { CurrencyType } from "@/schemas/currency.schema";
import RefreshButton from "@/components/RefreshButton";
import { Tooltip } from "react-tooltip";

const DailySummary = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const { data: currencies, isError: isCurrenciesError } =
    useGetCurrenciesQuery();

  const {
    data: dailySummary,
    isError: isDailySummaryError,
    isLoading: isDailySummaryLoading,
    refetch: refetchDailySummary,
  } = useGetDailySummaryQuery({
    date: selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

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

  const handleDateChange = (e: { value: Date | null }) => {
    setSelectedDate(e.value);
  };

  useEffect(() => {
    if (selectedDate) {
      refetchDailySummary();
    }
  }, [selectedDate, refetchDailySummary]);

  if (isDailySummaryLoading) {
    return <div>Loading...</div>;
  }

  if (isDailySummaryError || isCurrenciesError) {
    return (
      <ErrorComponent message="Failed to fetch daily summary or currencies" />
    );
  }

  const {
    transactions,
    finances,
    opening_balance,
    closing_balance,
    total_disbursements_by_payment_gateway,
    total_repayments_by_payment_gateway,
  } = dailySummary || {};

  const summary = {
    disbursements: transactions?.filter(
      (t) => t.transaction_type === "disbursement"
    ),
    repayments: transactions?.filter((t) => t.transaction_type === "repayment"),
    incomes: finances?.filter((f) => f.type === "income"),
    expenses: finances?.filter((f) => f.type === "expense"),
    balance: {
      openingBalance: opening_balance || 0,
      closingBalance: closing_balance || 0,
    },
    paymentMethods: [],
  };

  const calculateTotals = (items, field) => {
    const totals = {};
    items.forEach((item) => {
      if (totals[item.currency]) {
        totals[item.currency] += item[field];
      } else {
        totals[item.currency] = item[field];
      }
    });
    return totals;
  };

  const disbursementsTotals = calculateTotals(summary.disbursements, "debit");
  const repaymentsTotals = calculateTotals(summary.repayments, "credit");

  const footerTemplate = (totals) => {
    return (
      <div className="flex justify-between font-bold">
        <span>Totals:</span>
        <span>
          {Object.entries(totals).map(([currency, total]) => (
            <span key={currency} className="mr-4">
              {formatCurrency(
                total,
                currencies?.find((curr) => curr.id == currency)
              )}
            </span>
          ))}
        </span>
      </div>
    );
  };

  const paymentMethods = [];

  for (const [gateway, totals] of Object.entries(
    total_disbursements_by_payment_gateway || {}
  )) {
    for (const [currency, total] of Object.entries(totals)) {
      paymentMethods.push({
        method: gateway,
        currency: currency,
        totalCashed: 0,
        totalDisbursed: total,
      });
    }
  }

  for (const [gateway, totals] of Object.entries(
    total_repayments_by_payment_gateway || {}
  )) {
    for (const [currency, total] of Object.entries(totals)) {
      const existingMethod = paymentMethods.find(
        (pm) => pm.method === gateway && pm.currency === currency
      );
      if (existingMethod) {
        existingMethod.totalCashed += total;
      } else {
        paymentMethods.push({
          method: gateway,
          currency: currency,
          totalCashed: total,
          totalDisbursed: 0,
        });
      }
    }
  }

  summary.paymentMethods = paymentMethods;

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-primary-700">Daily Summary Report</h3>
        <div className="flex space-x-3 items-center">
          <RefreshButton onRefresh={() => refetchDailySummary()} />
          <Tooltip anchorSelect=".print-button" content="Print" />
          <Button
            type="button"
            icon="pi pi-print"
            severity="success"
            rounded
            // onClick={handlePrint}
            className="print-button"
            tooltipOptions={{ position: "left" }}
          />
          <Tooltip anchorSelect=".pdf-button" content="Export as PDF" />
          <Button
            type="button"
            icon="pi pi-file-pdf"
            severity="warning"
            rounded
            // onClick={exportPdf}
            className="pdf-button"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      </div>
      <div className="flex justify-content-between align-items-center mb-4">
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
          dateFormat="yy-mm-dd"
        />
      </div>
      <div className="grid">
        <div className="bg-primary flex justify-between w-full px-5 items-center">
          <div className="items-center">
            <p className="text-lg font-bold text-white">Opening Balance:</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">
              {summary.balance.openingBalance}
            </p>
          </div>
        </div>
        <div className="col-12 lg:col-6">
          <div className="bg-primary">
            <h4 className="p-1 items-center text-lg font-bold text-white">
              Disbursements
            </h4>
          </div>
          <DataTable
            value={summary.disbursements}
            footer={footerTemplate(disbursementsTotals)}
          >
            <Column
              field="created_at"
              header="Date"
              body={(rowData) => formatDateTime(rowData.created_at)}
              sortable
            />
            <Column field="client_name" header="Client Name" sortable />
            <Column
              field="debit"
              header="Amount"
              sortable
              body={amountBodyTemplate}
            />
            <Column field="payment_gateway" header="Payment Method" sortable />
          </DataTable>
        </div>
        <div className="col-12 lg:col-6">
          <div className="bg-primary">
            <h4 className="p-1 items-center text-lg font-bold text-white">
              Repayments
            </h4>
          </div>
          <DataTable
            value={summary.repayments}
            footer={footerTemplate(repaymentsTotals)}
          >
            <Column
              field="created_at"
              header="Date"
              body={(rowData) => formatDateTime(rowData.created_at)}
              sortable
            />
            <Column field="client_name" header="Client Name" sortable />
            <Column
              field="credit"
              header="Amount"
              sortable
              body={amountBodyTemplate}
            />
            <Column field="payment_method" header="Payment Method" sortable />
          </DataTable>
        </div>
        <div className="col-12">
          <div className="bg-primary">
            <h4 className="p-1 items-center text-lg font-bold text-white">
              Amounts by Payment Method
            </h4>
          </div>
          <DataTable value={summary.paymentMethods}>
            <Column field="method" header="Payment Method" sortable />
            <Column field="currency" header="Currency" sortable />
            <Column field="totalCashed" header="Total Cashed" sortable />
            <Column field="totalDisbursed" header="Total Disbursed" sortable />
          </DataTable>
        </div>
        <div className="bg-primary flex justify-between w-full px-5 items-center">
          <div className="items-center">
            <p className="text-lg font-bold text-white">Closing Balance:</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">
              {summary.balance.closingBalance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
