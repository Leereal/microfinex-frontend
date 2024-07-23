"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useGetLoansQuery } from "@/redux/features/loanApiSlice"; // Adjust the import as needed
// import LoanTransactionModal from "./_components/LoanTransactionModal"; // Create this component
import LoanTransactionList from "./_components/LoanTransactionList";

const LoanTransactionsPage = () => {
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(false);
  const { data: transactions, isLoading } = useGetLoansQuery();

  const showError = (errorMessage: string) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Transaction Failed",
        detail: errorMessage || "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const showSuccess = () => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Transaction Processed",
        detail: "Transaction has been processed successfully.",
        life: 3000,
      });
    }
  };

  const onCreateTransaction = () => {
    setVisible(true);
  };

  const onHideModal = () => {
    setVisible(false);
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <LoanTransactionList
          onCreate={onCreateTransaction}
          showError={showError}
        />
      </div>
      {/* {transactions && (
        <LoanTransactionModal
          visible={visible}
          onHide={onHideModal}
          showSuccess={showSuccess}
          showError={showError}
          transactions={transactions}
        />
      )} */}
    </div>
  );
};

export default LoanTransactionsPage;
