import React from "react";
import { classNames } from "primereact/utils";
import { InputMask } from "primereact/inputmask";
import { Controller, useFormContext } from "react-hook-form";

type FormInputMaskProps = {
  label: string;
  id: string;
  mask: string;
  placeholder: string;
  slotChar: string;
  register: any;
  error?: any;
};

const FormInputMask: React.FC<FormInputMaskProps> = ({
  label,
  id,
  mask,
  placeholder,
  slotChar,
  register,
  error,
}) => {
  const { setValue } = useFormContext(); // Access setValue function from useFormContext

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Controller
        name={id}
        control={register.control} // Assuming register is passed from useForm or FormProvider
        render={({ field }) => (
          <InputMask
            id={id}
            value={field.value}
            onChange={(e) => {
              setValue(id, e.target.value); // Set the selected value to form state
              field.onChange(e.target.value); // Update the field value
            }}
            mask={mask}
            placeholder={placeholder}
            slotChar={slotChar}
            className={classNames({ "p-invalid": !!error })}
          />
        )}
      />
      {error && <small className="p-error">{error.message}</small>}
    </div>
  );
};

export default FormInputMask;