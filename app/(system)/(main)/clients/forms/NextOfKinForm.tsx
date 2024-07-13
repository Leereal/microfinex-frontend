import React from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "@/components/FormInput";

const NextOfKinForm: React.FC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
  return (
    <section>
      <h2 className="text-primary text-xl font-semibold">Next of Kin</h2>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Full Name"
            id="next_of_kin_name"
            type="text"
            placeholder="Full Name"
            register={register}
            error={errors.next_of_kin_name}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Relationship"
            id="next_of_kin_relationship"
            type="text"
            placeholder="Relationship"
            register={register}
            error={errors.next_of_kin_relationship}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Phone"
            id="next_of_kin_phone"
            type="text"
            placeholder="Phone"
            register={register}
            error={errors.next_of_kin_phone}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Email"
            id="next_of_kin_email"
            type="email"
            placeholder="Email"
            register={register}
            error={errors.next_of_kin_email}
          />
        </div>
      </div>
    </section>
  );
};

export default NextOfKinForm;
