import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useForm, FormProvider } from "react-hook-form";
import FormAutoComplete from "@/components/FormAutoComplete";
import { useCreateTransactionMutation } from "@/redux/features/transactionApiSlice";
import { useGetChargesQuery } from "@/redux/features/chargeApiSlice";
import { LoanType } from "@/types/common";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { formatCurrency } from "@/utils/helpers";
import { CreateLoanTransactionType } from "@/schemas/transaction.schema";
import { ChargeType } from "@/schemas/charge.schema";

type ChargeLoanModalProps = {
  visible: boolean;
  onHide: () => void;
  showSuccess: () => void;
  showError: (errorMessage: string) => void;
  selectedLoans: LoanType[];
};

const ChargeLoanModal = ({
  visible,
  onHide,
  showSuccess,
  showError,
  selectedLoans,
}: ChargeLoanModalProps) => {
  const { data: charges = [], isLoading: chargesLoading } =
    useGetChargesQuery();
  const [filteredCharges, setFilteredCharges] = useState<ChargeType[]>(charges);
  const [createTransaction, { isLoading: transactionLoading }] =
    useCreateTransactionMutation();
  const { data: currencies = [] } = useGetCurrenciesQuery();

  const form = useForm({
    defaultValues: {
      charge_id: "",
    },
  });

  // Extract currency from selectedLoans
  const selectedLoanCurrency =
    selectedLoans.length > 0 ? selectedLoans[0].currency : null;

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = form;

  const selectedChargeId = watch("charge_id");

  const selectedCharge = charges.find(
    (charge: ChargeType) => charge.id === Number(selectedChargeId)
  );

  const onSubmit = async (data: any) => {
    try {
      if (!selectedCharge) {
        setError("charge_id", {
          type: "manual",
          message: "Charge not selected",
        });
        return;
      }

      const transactionPromises = selectedLoans.map((loan) => {
        const transaction: CreateLoanTransactionType = {
          loan_id: loan.id,
          transaction_type: "charge",
          debit:
            selectedCharge.charge_type === "debit"
              ? selectedCharge.amount
              : null,
          credit:
            selectedCharge.charge_type === "credit"
              ? selectedCharge.amount
              : null,
          description: selectedCharge.description || "",
          payment_gateway: null,
        };
        return createTransaction(transaction).unwrap();
      });

      await Promise.all(transactionPromises);

      showSuccess();
      reset();
      onHide();
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to process charge. Please try again.";
      showError(errorMessage);
    }
  };

  const searchCharges = (event: any) => {
    const query = event.query.toLowerCase();
    const filtered = charges.filter(
      (charge: ChargeType) =>
        (charge?.name.toLowerCase().includes(query) ||
          charge?.description?.toLowerCase().includes(query)) &&
        selectedLoanCurrency === charge.currency
    );
    setFilteredCharges(filtered);
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header="Add Charge to Loan"
      modal
      className="p-fluid"
      onHide={onHide}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {currencies.length > 0 && (
            <FormAutoComplete
              label="Charge"
              id="charge_id"
              options={filteredCharges.map((charge: ChargeType) => ({
                label: `${charge.name} - ${formatCurrency(
                  charge.amount,
                  currencies.find((currency) => currency.id === charge.currency)
                )}`,
                value: charge.id,
              }))}
              search={searchCharges}
              placeholder="Select a Charge"
              field="label"
              error={errors.charge_id}
            />
          )}
          {selectedCharge && (
            <div className="flex">
              <p className="font-bold">
                Amount:{" "}
                {formatCurrency(
                  selectedCharge.amount,
                  currencies.find(
                    (currency) => currency.id === selectedCharge.currency
                  )
                )}
              </p>
            </div>
          )}
          <div className="p-dialog-footer pb-0">
            <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
            <Button
              type="submit"
              label="Add Charge"
              icon="pi pi-check"
              text
              disabled={transactionLoading || chargesLoading}
            />
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ChargeLoanModal;
