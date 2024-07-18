"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import ChargeList from "./_components/ChargeList";
import ChargeModal from "./_components/ChargeModal";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { useGetLoanStatusesQuery } from "@/redux/features/loanStatusApiSlice";

const ChargesPage = () => {
  const toast = useRef<Toast | null>(null);
  const {
    data: currencies,
    isLoading: isCurrenciesLoading,
    isError: isCurrenciesError,
  } = useGetCurrenciesQuery();

  const { data: loanStatuses } = useGetLoanStatusesQuery();

  const [visible, setVisible] = useState(false);

  const onHideModal = () => {
    setVisible(false);
  };

  const showError = (errorMessage: string) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Loans Failed",
        detail: errorMessage || "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const showSuccess = () => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Loan Disbursed",
        detail: "Loan has been disbursed successfully.",
        life: 3000,
      });
    }
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <ChargeList onCreate={() => setVisible(true)} />
      </div>
      {currencies && loanStatuses && (
        <ChargeModal
          visible={visible}
          onHide={onHideModal}
          currencies={currencies}
          loanStatuses={loanStatuses}
          showSuccess={showSuccess}
          showError={showError}
        />
      )}
    </div>
  );
};

export default ChargesPage;
