import React from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "@/components/FormInput";

const AddressInfoForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section>
      <h2 className="text-primary text-xl font-semibold">Address Information</h2>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Street Number"
            id="street_number"
            type="text"
            placeholder="Street Number"
            register={register}
            error={errors.street_number}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Suburb"
            id="suburb"
            type="text"
            placeholder="Suburb"
            register={register}
            error={errors.suburb}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Zip Code"
            id="zip_code"
            type="text"
            placeholder="Zip Code"
            register={register}
            error={errors.zip_code}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="City"
            id="city"
            type="text"
            placeholder="City"
            register={register}
            error={errors.city}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInput
            label="State"
            id="state"
            type="text"
            placeholder="State"
            register={register}
            error={errors.state}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Country"
            id="country"
            type="text"
            placeholder="Country"
            register={register}
            error={errors.country}
          />
        </div>
      </div>
    </section>
  );
};

export default AddressInfoForm;
