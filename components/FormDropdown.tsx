import React from "react";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Controller, useFormContext } from "react-hook-form";

type FormDropdownProps = {
  label?: string;
  id: string;
  options: any[];
  placeholder?: string;
  register: any;
  error?: any;
  showClear?: boolean;
  defaultValue?: any; // Add defaultValue prop
  className?: string;
};

const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  id,
  options,
  placeholder,
  register,
  error,
  showClear,
  defaultValue, // Receive defaultValue from props
  className,
}) => {
  const { setValue } = useFormContext(); // Access setValue function from useFormContext
  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <Controller
        name={id}
        control={register.control} // Assuming register is passed from useForm or FormProvider
        render={({ field }) => (
          <Dropdown
            id={id}
            value={field.value || defaultValue?.value} // Set the value directly from field.value
            onChange={(e) => {
              setValue(id, e.value); // Set the selected value to form state
              field.onChange(e.value); // Update the field value
            }}
            options={options}
            placeholder={placeholder}
            className={classNames({ "p-invalid": !!error }, className)}
            showClear={showClear}
          />
        )}
      />
      {error && <small className="p-error">{error.message}</small>}
    </div>
  );
};

export default FormDropdown;
