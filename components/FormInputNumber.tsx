import React from "react";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useFormContext } from "react-hook-form";

type FormInputNumberProps = {
  label: string;
  id: string;
  error?: any;
  showButtons?: boolean;
};

const FormInputNumber: React.FC<FormInputNumberProps> = ({
  label,
  id,
  error,
  showButtons,
}) => {
  const { control } = useFormContext();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <InputNumber
            id={id}
            placeholder={label}
            value={field.value}
            onValueChange={(e) => field.onChange(e.value)}
            showButtons={showButtons}
            className={classNames({ "p-invalid": !!error })}
          />
        )}
      />
      {error && <small className="p-error">{error?.message}</small>}
    </div>
  );
};
export default FormInputNumber;
