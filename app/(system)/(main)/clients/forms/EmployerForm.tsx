import React from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "@/components/FormInput";

const EmployerForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section>
      <h2 className="text-primary text-xl font-semibold">Employer Information</h2>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Employer Name"
            id="employer_name"
            type="text"
            placeholder="Employer Name"
            register={register}
            error={errors.employer_name}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Job Title"
            id="job_title"
            type="text"
            placeholder="Job Title"
            register={register}
            error={errors.job_title}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Phone"
            id="employer_phone"
            type="text"
            placeholder="Phone"
            register={register}
            error={errors.employer_phone}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Email"
            id="employer_email"
            type="email"
            placeholder="Email"
            register={register}
            error={errors.employer_email}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Address"
            id="employer_address"
            type="text"
            placeholder="Address"
            register={register}
            error={errors.employer_address}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="City"
            id="employer_city"
            type="text"
            placeholder="City"
            register={register}
            error={errors.employer_city}
          />
        </div>
      </div>
    </section>
  );
};

export default EmployerForm;
