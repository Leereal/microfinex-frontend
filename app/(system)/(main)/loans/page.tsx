"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useDisburseLoanMutation,
  useGetLoansQuery,
} from "@/redux/features/loanApiSlice";
import { DisbursementTypeSchema } from "@/schemas/common.schemas";
import { disbursementDefaultValues } from "@/constants/default.values";
import LoanList from "./_components/LoanList";
import LoanModal from "./_components/LoanModal";
import { ProgressSpinner } from "primereact/progressspinner";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { useGetClientsQuery } from "@/redux/features/clientApiSlice";
import { DevTool } from "@hookform/devtools";

const LoansPage = () => {
  const toast = useRef<Toast | null>(null);
  const { data: loans, isError, isLoading } = useGetLoansQuery();
  const { data: currencies } = useGetCurrenciesQuery();
  const { data: clients } = useGetClientsQuery();
  const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(DisbursementTypeSchema),
    defaultValues: disbursementDefaultValues,
  });

  const [disburseLoan] = useDisburseLoanMutation();

  const onSubmit = async (data: DisbursementType) => {
    disburseLoan(data)
      .unwrap()
      .then(() => {
        showSuccess();
        reset();
      })
      .catch(() => {
        showError("Failed to disburse loan. Please try again.");
      });
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

  const onDisburseLoan = () => {
    setVisible(true);
  };

  const onHideModal = () => {
    reset();
    setVisible(false);
  };
  useEffect(() => {
    if (isSubmitting) {
      setVisible(false);
    }
    if (isError) {
      showError("Error fetching branches");
    }
  }, [isError, isSubmitting]);

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        {isLoading && <ProgressSpinner />}
        {loans && <LoanList loans={loans} onCreate={onDisburseLoan} />}
      </div>
      {clients && currencies && (
        <LoanModal
          visible={visible}
          onHide={onHideModal}
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          clients={clients}
          currencies={currencies}
          control={control}
        />
      )}
      <DevTool control={control} />
    </div>
  );
};

export default LoansPage;
