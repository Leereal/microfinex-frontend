"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useGetLoansQuery, useGetRepaymentsQuery } from "@/redux/features/loanApiSlice"; // Adjust the import as needed
import RepaymentModal from "./_components/RepaymentModal"; // Create this component
import { ProgressSpinner } from "primereact/progressspinner";
import { useGetPaymentGatewaysQuery } from "@/redux/features/paymentGatewayApiSlice";
import RepaymentList from "./_components/RepaymentList";

const RepaymentsPage = () => {
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(false);
  const {
    data: repayments,
    isLoading: isRepaymentsLoading,
    isError: isRepaymentsError,
  } = useGetRepaymentsQuery();

  const { data: paymentGateways, isLoading: isGatewaysLoading } = useGetPaymentGatewaysQuery();
  const { data: loans, isLoading: isLoansLoading } = useGetLoansQuery();

  const showError = (errorMessage: string) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Repayment Failed",
        detail: errorMessage || "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const showSuccess = () => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Repayment Processed",
        detail: "Repayment has been processed successfully.",
        life: 3000,
      });
    }
  };

  const onCreateRepayment = () => {
    setVisible(true);
  };

  const onHideModal = () => {
    setVisible(false);
  };

  return (
    <div className="grid">   
      <Toast ref={toast} />
       <div className="col-12">
       {isRepaymentsLoading ? (
          <ProgressSpinner />
        ) : isRepaymentsError ? (
          <div>Error loading repayments</div>
        ) : (
          <RepaymentList onCreate={onCreateRepayment} showError={showError} />
        )}
      </div>   
 {loans && paymentGateways && !isGatewaysLoading && !isLoansLoading && (
        <RepaymentModal
          visible={visible}
          onHide={onHideModal}
          showSuccess={showSuccess}
          showError={showError}
          loans={loans}
          paymentGateways={paymentGateways}
        />
      )}
    </div>
  );
};

export default RepaymentsPage;
