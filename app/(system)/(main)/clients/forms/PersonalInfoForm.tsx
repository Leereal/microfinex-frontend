import React from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "@/components/FormInput";
import FormCalendar from "@/components/FormCalendar";
import { GenderEnum, TitleEnum } from "@/schemas/client.schema";
import FormDropdown from "@/components/FormDropdown";
import FormRadioButton from "@/components/FormRadioButton";
import FormInputMask from "@/components/FormInputMask";

const PersonalInfoForm: React.FC = () => {
  const titles = TitleEnum.options.map((title) => ({
    label: title,
    value: title,
  }));

  const genderOptions = GenderEnum.options.map((gender) => ({
    label: gender,
    value: gender,
  }));

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section>
      <div className="my-2 space-y-1">
        <h2 className="text-primary text-xl font-semibold">
          Personal Information
        </h2>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-full sm:w-1/2">
          <FormDropdown
            label="Title"
            id="title"
            options={titles}
            placeholder="Select a Title"
            register={register}
            error={errors.title}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormRadioButton
            label="Gender"
            id="gender"
            options={genderOptions}
            register={register}
            error={errors.gender}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInput
            label="First Name"
            id="first_name"
            type="text"
            placeholder="First Name"
            register={register}
            error={errors.first_name}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Last Name"
            id="last_name"
            type="text"
            placeholder="Last Name"
            register={register}
            error={errors.last_name}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInput
            label="National ID"
            id="national_id"
            type="text"
            placeholder="National ID"
            register={register}
            error={errors.national_id}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Nationality"
            id="nationality"
            type="text"
            placeholder="Nationality"
            register={register}
            error={errors.nationality}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="w-full sm:w-1/2">
          <FormInputMask
            label="Date of Birth"
            id="date_of_birth"
            mask="99/99/9999"
            placeholder="dd/mm/yyyy"
            slotChar="dd/mm/yyyy"
            register={register}
            error={errors.date_of_birth}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Email"
            id="emails"
            type="email"
            placeholder="Email"
            register={register}
            error={errors.emails}
          />
        </div>
      </div>
    </section>
  );
};

export default PersonalInfoForm;