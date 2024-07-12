import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";

type FormTextAreaProps = {
  label?: string;
  id: string;
  error?: any;
  className?: string;
  rows?: number;
  cols?: number;
};

const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  id,
  error,
  className,
  rows = 5,
  cols = 30,
}) => {
  const { control } = useFormContext();

  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <InputTextarea
            id={id}
            {...field}
            rows={rows}
            cols={cols}
            className={className}
          />
        )}
      />
      {error && <small className="p-error">{error.message}</small>}
    </div>
  );
};

export default FormTextArea;
