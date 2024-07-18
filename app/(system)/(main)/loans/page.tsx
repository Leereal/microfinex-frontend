"use client";
import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import LoanList from "./_components/LoanList";
import LoanModal from "./_components/LoanModal";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { useGetClientsQuery } from "@/redux/features/clientApiSlice";
import { useGetGlobalSettingsQuery } from "@/redux/features/globalSettingsApiSlice";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useGetBranchSettingsQuery } from "@/redux/features/branchSettingsApiSlice";
import { useGetBranchProductsQuery } from "@/redux/features/branchProductApiSlice";
import { useGetPaymentGatewaysQuery } from "@/redux/features/paymentGatewayApiSlice";

const LoansPage = () => {
  const toast = useRef<Toast>(null);
  const user = useCurrentUser();
  const [visible, setVisible] = useState(false);

  const {
    data: clients,
    isError: isClientsError,
    isLoading: isClientsLoading,
  } = useGetClientsQuery();

  const {
    data: currencies,
    isError: isCurrenciesError,
    isLoading: isCurrenciesLoading,
  } = useGetCurrenciesQuery();

  const { data: branchSettings, isLoading: branchSettingsLoading } =
    useGetBranchSettingsQuery(user!.active_branch!);

  const { data: branchProducts, isLoading: branchProductsLoading } =
    useGetBranchProductsQuery();

  const { data: globalSettings, isLoading: globalSettingsLoading } =
    useGetGlobalSettingsQuery();

  const { data: payment_gateways, isLoading: payment_gatewaysLoading } =
    useGetPaymentGatewaysQuery();

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

  const onDisburseLoan = () => {
    setVisible(true);
  };

  const onHideModal = () => {
    setVisible(false);
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        {
          <LoanList
            onCreate={onDisburseLoan}
            showError={showError}
            waiting={
              clients &&
              currencies &&
              globalSettings &&
              branchSettings &&
              branchProducts &&
              payment_gateways &&
              !branchSettingsLoading
                ? false
                : true
            }
          />
        }
      </div>
      {clients &&
        currencies &&
        globalSettings &&
        branchSettings &&
        branchProducts &&
        payment_gateways &&
        !branchSettingsLoading && (
          <LoanModal
            visible={visible}
            onHide={onHideModal}
            showSuccess={showSuccess}
            showError={showError}
            clients={clients}
            currencies={currencies}
            globalSettings={globalSettings}
            branchSettings={branchSettings}
            branchProducts={branchProducts}
            payment_gateways={payment_gateways}
          />
        )}
    </div>
  );
};

export default LoansPage;
