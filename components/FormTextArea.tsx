// FormTextarea.tsx
import React from "react";
import { classNames } from "primereact/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { Controller, useFormContext } from "react-hook-form";

type FormTextareaProps = {
  label: string;
  id: string;
  placeholder: string;
  error?: any;
  className?: string;
};

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  id,
  placeholder,
  error,
  className,
}) => {
  const { control } = useFormContext();

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <InputTextarea
            autoResize
            id={id}
            value={field.value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              field.onChange(e.target.value)
            }
            placeholder={placeholder}
            className={classNames({ "p-invalid": !!error }, className)}
          />
        )}
      />
      {error && <small className="p-error">{error?.message}</small>}
    </div>
  );
};

export default FormTextarea;
