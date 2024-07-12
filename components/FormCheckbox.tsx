import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "primereact/checkbox";

type FormCheckboxProps = {
  label: string;
  id: string;
  register: any;
  error?: any;
  className?: string;
};

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  id,
  register,
  error,
  className
}) => {
  const { setValue } = useFormContext();

  return (
    <div className="field">
      <div className="flex align-items-center">
        <Controller
          name={id}
          control={register.control}
          render={({ field }) => (
            <Checkbox
              inputId={id}
              onChange={(e) => {
                setValue(id, e.checked);
                field.onChange(e.checked);
              }}
              checked={field.value}
              className={className}
            />
          )}
        
        />
        <label htmlFor={id} className="ml-2">
          {label}
        </label>
      </div>
      {error && <small className="p-error">{error.message}</small>}
    </div>
  );
};

export default FormCheckbox;

