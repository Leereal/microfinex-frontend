import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "@/components/FormInput";
import FormCalendar from "@/components/FormCalendar";
import FormInputNumber from "@/components/FormInputNumber";
import FormAutocomplete from "@/components/FormAutoComplete";
import FormDropdown from "@/components/FormDropdown";
import { useDisburseLoanMutation } from "@/redux/features/loanApiSlice";
import { disbursementDefaultValues } from "@/constants/default.values";
import { ClientType } from "@/schemas/client.schema";
import { CurrencyType } from "@/schemas/currency.schema";
import {
  DisbursementSchema,
  DisbursementType,
} from "@/schemas/disbursement.schema";
import { GlobalSettingsType } from "@/schemas/global-settings.schemas";
import { BranchSettingsType } from "@/schemas/branch-settings.schemas";
import { BranchProductResponseSchema } from "@/schemas/branch-product.schemas";

type LoanModalProps = {
  visible: boolean;
  onHide: () => void;
  showSuccess: () => void;
  showError: (errorMessage: string) => void;
  clients: ClientType[];
  currencies: CurrencyType[];
  globalSettings: GlobalSettingsType[];
  branchSettings?: BranchSettingsType;
  branchProducts: any;
};

const LoanModal = ({
  visible,
  onHide,
  showSuccess,
  showError,
  clients,
  currencies,
  globalSettings,
  branchSettings,
  branchProducts,
}: LoanModalProps) => {
  const [disburseLoan, { isLoading }] = useDisburseLoanMutation();

  const defaultCurrency =
    // branchSettings && branchSettings.currency_code!
    //   ? currencies.find((currency) => currency.code === branchSettings.currency_code):
    globalSettings && globalSettings.length
      ? currencies.find(
          (currency) => currency.code === globalSettings[0].currency_code
        )
      : undefined;
  const form = useForm({
    resolver: zodResolver(DisbursementSchema),
    defaultValues: {
      ...disbursementDefaultValues,
      currency: defaultCurrency ? defaultCurrency.id : null, // Adjust as per your form structure
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setError,
    reset,
  } = form;

  const selectedBranchProductId = watch("branch_product");
  const selectedBranchProduct = branchProducts.find(
    (product: any) => product.id === selectedBranchProductId
  );

  const selectedClientId = watch("client");
  const selectedClient = clients.find(
    (client: any) => client.id === selectedClientId
  );

  const onSubmit = async (data: DisbursementType) => {
    const maxLoanAmount = Math.min(
      selectedBranchProduct?.max_amount || Infinity,
      selectedClient?.client_limit?.max_loan || Infinity
    );
    const minLoanAmount =
      selectedBranchProduct?.min_amount || branchSettings?.min_loan_amount || 0;

    if (data.amount < minLoanAmount || data.amount > maxLoanAmount) {
      showError(
        `Loan amount must be between ${minLoanAmount} and ${maxLoanAmount}.`
      );
      return;
    }
    disburseLoan(data)
      .unwrap()
      .then(() => {
        showSuccess();
        reset();
        onHide();
      })
      .catch((error: any) => {
        showError("Failed to disburse loan. Please try again.");
        if (error.data) {
          Object.keys(error.data).forEach((field) => {
            setError(field as keyof DisbursementType, {
              type: "manual",
              message: error.data[field][0],
            });
          });
        } else {
          showError("Failed to disburse loan. Please try again.");
        }
      });
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  return (
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header="Disburse Loan"
      modal
      className="p-fluid"
      onHide={onHide}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormAutocomplete
            label="Client"
            id="client"
            error={errors.client}
            clients={clients} // Assuming clientList is your list of clients
            control={control}
          />
          <FormInputNumber
            label="Amount"
            id="amount"
            error={errors.amount}
            showButtons
          />
          <FormDropdown
            label="Currency"
            id="currency"
            options={currencies.map((currency) => ({
              label: currency.name,
              value: currency.id,
            }))}
            placeholder="Select a Currency"
            register={register}
            error={errors.currency}
            defaultValue={
              defaultCurrency && {
                label: defaultCurrency.name,
                value: defaultCurrency.id,
              }
            } // Pass defaultCurrency's ID as defaultValue
            showClear
          />
          <FormCalendar
            label="Expected Repayment Date"
            id="expected_repayment_date"
            error={errors.date}
            register={register}
            showIcon={true}
          />
          <FormDropdown
            label="Branch Product"
            id="branch_product"
            options={branchProducts.map((product: any) => ({
              label: `${product.branch.name} - ${product.product.name}`,
              value: product.id,
            }))}
            placeholder="Select a Product"
            register={register}
            error={errors.branch_product}
          />
          <div className="p-dialog-footer pb-0">
            <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
            <Button
              type="submit"
              label="Disburse Loan"
              icon="pi pi-check"
              text
              disabled={isLoading}
            />
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default LoanModal;
