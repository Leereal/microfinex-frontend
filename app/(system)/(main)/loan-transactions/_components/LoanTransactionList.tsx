"use client";
import React from "react";
import LoanTransactionTable from "./LoanTransactionTable";

const LoanTransactionList = ({
  showError,
}: {
  onCreate: () => void;
  showError: any;
}) => {
  return (
    <div className="card">
      <h3 className="font-bold text-primary-700">Loan Transactions List</h3>
      <LoanTransactionTable showError={showError} />
    </div>
  );
};

export default LoanTransactionList;
