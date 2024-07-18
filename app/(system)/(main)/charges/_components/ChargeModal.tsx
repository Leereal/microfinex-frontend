import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "@/components/FormInput";
import FormInputNumber from "@/components/FormInputNumber";
import FormDropdown from "@/components/FormDropdown";
import {
  CreateChargeSchema,
  CreateChargeType,
  chargeDefaultValues,
} from "@/schemas/charge.schema";
import FormTextArea from "@/components/FormTextArea";
import { useGetGlobalSettingsQuery } from "@/redux/features/globalSettingsApiSlice";
import { CurrencyType } from "@/schemas/currency.schema";
import { LoanStatusType } from "@/schemas/loanStatus.schema";
import {
  useCreateChargeMutation,
  useGetChargesQuery,
} from "@/redux/features/chargeApiSlice";

type ChargeModalProps = {
  visible: boolean;
  onHide: () => void;
  showSuccess: () => void;
  showError: (errorMessage: string) => void;
  currencies: CurrencyType[];
  loanStatuses: LoanStatusType[];
};

const ChargeModal = ({
  visible,
  onHide,
  showSuccess,
  showError,
  currencies,
  loanStatuses,
}: ChargeModalProps) => {
  const form = useForm({
    resolver: zodResolver(CreateChargeSchema),
    defaultValues: chargeDefaultValues,
  });

  // createCharge mutation
  const [createCharge, { isLoading }] = useCreateChargeMutation();
  const { refetch } = useGetChargesQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = form;

  const { data: globalSettings } = useGetGlobalSettingsQuery();

  const defaultCurrency =
    globalSettings && globalSettings.length
      ? currencies.find(
          (currency) => currency.code === globalSettings[0].currency_code
        )
      : undefined;

  const onSubmit = async (data: CreateChargeType) => {
    try {
      const result = await createCharge(data).unwrap();
      refetch();
      showSuccess();
      reset();
      onHide();
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to process repayment. Please try again.";
      showError(errorMessage);
      if (error.data) {
        Object.keys(error.data).forEach((field) => {
          setError(field as keyof CreateChargeType, {
            type: "manual",
            message: error.data[field][0],
          });
        });
      }
    }
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header="Charge"
      modal
      className="p-fluid"
      onHide={onHide}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Name"
            id="name"
            type="text"
            placeholder="Name"
            register={register}
            error={errors.name}
          />
          <FormTextArea
            label="Description"
            id="description"
            error={errors.description}
            placeholder="Description of what the charge is about"
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
            }
            showClear
          />
          <FormDropdown
            label="Amount Type"
            id="amount_type"
            options={[
              { label: "Fixed", value: "fixed" },
              { label: "Percentage", value: "percentage" },
            ]}
            placeholder="Select Amount Type"
            register={register}
            error={errors.amount_type}
          />
          <FormDropdown
            label="Charge Type (Credit is for Rebates | Debit is for Penalties)"
            id="charge_type"
            options={[
              { label: "Credit", value: "credit" },
              { label: "Debit", value: "debit" },
            ]}
            placeholder="Select Charge Type"
            register={register}
            error={errors.charge_type}
          />
          <FormDropdown
            label="Charge Application"
            id="charge_application"
            options={[
              { label: "Principal", value: "principal" },
              { label: "Balance", value: "balance" },
              { label: "Other", value: "other" },
            ]}
            placeholder="Select Charge Application"
            register={register}
            error={errors.charge_application}
          />
          <FormDropdown
            label="Loan Status"
            id="loan_status"
            options={loanStatuses.map((loanStatus: LoanStatusType) => ({
              label: loanStatus.name,
              value: loanStatus.id,
            }))}
            placeholder="Select Loan Status"
            register={register}
            error={errors.loan_status}
          />
          <FormDropdown
            label="Mode"
            id="mode"
            options={[
              { label: "Manual", value: "manual" },
              { label: "Auto", value: "auto" },
            ]}
            placeholder="Select Mode"
            register={register}
            error={errors.mode}
          />
          <div>
            {errors && errors.root && (
              <small className="p-error">{errors?.root?.message}</small>
            )}
          </div>
          <div className="p-dialog-footer pb-0">
            <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
            <Button
              type="submit"
              label="Save"
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

export default ChargeModal;
