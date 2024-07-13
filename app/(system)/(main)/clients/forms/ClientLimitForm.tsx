import React from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "@/components/FormInput";
import FormDropdown from "@/components/FormDropdown";
import { CurrencyType } from "@/schemas/currency.schema";


const ClientLimitForm: React.FC<{ currencies: CurrencyType[] }> = ({ currencies }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section>
      <h2 className="text-primary text-xl font-semibold">Client Limit Information</h2>
    
      <div className="flex flex-col gap-4 sm:flex-row">
      <div className="w-full sm:w-1/2">
        <FormInput
          label="Amount"
          id="client_limit.amount"
          type="text"
          placeholder="Amount"
          register={register}
          error={errors.client_limit?.amount}
        />
        </div>
        <div className="w-full sm:w-1/2">
        <FormDropdown
          label="Currency"
          id="client_limit.currency"
          placeholder="Select a Currency"
          options={currencies}    
          error={errors.client_limit?.currency}
          register={register}
        />
        </div>
      </div>
    </section>
  );
};

export default ClientLimitForm;
