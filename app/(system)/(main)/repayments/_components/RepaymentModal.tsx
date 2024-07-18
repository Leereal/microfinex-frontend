import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import FormInputNumber from "@/components/FormInputNumber";
import FormDropdown from "@/components/FormDropdown";
import { useRepayLoanMutation } from "@/redux/features/loanApiSlice";
import {
  repaymentDefaultValues,
  RepaymentSchema,
  RepaymentType,
} from "@/schemas/repayment.schema";
import PaymentReceipt from "@/components/templates/payment-receipt";
import FormAutoComplete from "@/components/FormAutoComplete";
import { LoanType, PaymentGatewayType } from "@/types/common";

type RepaymentModalProps = {
  visible: boolean;
  onHide: () => void;
  showSuccess: () => void;
  showError: (errorMessage: string) => void;
  loans: LoanType[];
  paymentGateways: PaymentGatewayType[];
};

const RepaymentModal = ({
  visible,
  onHide,
  showSuccess,
  showError,
  loans,
  paymentGateways,
}: RepaymentModalProps) => {
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [filteredLoans, setFilteredLoans] = useState<LoanType[]>(loans);

  const [repayLoan, { isLoading }] = useRepayLoanMutation();

  const form = useForm({
    resolver: zodResolver(RepaymentSchema),
    defaultValues: repaymentDefaultValues,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = form;

  const searchLoans = (event: any) => {
    setTimeout(() => {
      if (!event.query.trim().length) {
        setFilteredLoans([...loans]);
      } else {
        setFilteredLoans(
          loans.filter((loan) =>
            loan.client_full_name
              .toLowerCase()
              .startsWith(event.query.toLowerCase())
          )
        );
      }
    }, 250);
  };

  const onSubmit = async (data: RepaymentType) => {
    try {
      const result = await repayLoan(data).unwrap();

      showSuccess();
      reset();
      onHide();
      setReceiptData(result);
      setIsReceiptModalVisible(true);
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to process repayment. Please try again.";
      showError(errorMessage);
      if (error.data) {
        Object.keys(error.data).forEach((field) => {
          setError(field as keyof RepaymentType, {
            type: "manual",
            message: error.data[field][0],
          });
        });
      }
    }
  };

  return (
    <>
      <Dialog
        visible={visible}
        style={{ width: "450px" }}
        header="Repay Loan"
        modal
        className="p-fluid"
        onHide={onHide}
      >
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormAutoComplete
              label="Loans"
              id="loan_id"
              options={filteredLoans.map((loan: LoanType) => ({
                label: `${loan.client_full_name} - ${loan.balance}`,
                value: loan.id,
              }))}
              search={searchLoans}
              field="label"
              placeholder="Search for a Loan"
              error={errors.loan_id}
            />
            <FormDropdown
              label="Payment Gateway"
              id="payment_gateway_id"
              options={paymentGateways.map((gateway: PaymentGatewayType) => ({
                label: gateway.name,
                value: gateway.id,
              }))}
              placeholder="Select a Payment Gateway"
              register={register}
              error={errors.payment_gateway_id}
            />
            <FormInputNumber
              label="Amount"
              id="amount"
              error={errors.amount}
              showButtons
            />
            <div className="p-dialog-footer pb-0">
              <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
              <Button
                type="submit"
                label="Repay Loan"
                icon="pi pi-check"
                text
                disabled={isLoading}
              />
            </div>
          </form>
        </FormProvider>
      </Dialog>
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

export default RepaymentModal;
