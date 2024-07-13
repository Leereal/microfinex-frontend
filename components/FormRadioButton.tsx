import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { RadioButton } from 'primereact/radiobutton';

type FormRadioButtonProps = {
  label?: string;
  id: string;
  options: { label: string; value: string | boolean }[];
  register: any;
  error?: any;
  className?: string;
  onChange?: (e: any) => void; // Optional onChange handler
};

const FormRadioButton: React.FC<FormRadioButtonProps> = ({
  label,
  id,
  options,
  register,
  error,
  className,
  onChange,
}) => {
  const { setValue } = useFormContext();

  return (
    <div className="field">
      {label && (<label htmlFor={id}>{label}</label>)}
      <Controller
        name={id}
        control={register.control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-3">
            {options.map((option) => (
              <div key={option.label} className="flex align-items-center">
                <RadioButton
                  inputId={typeof option.value === "string" ? `${id}-${option.value}` : `${id}-${option.value.toString()}`}
                  name={id}
                  value={option.value}
                  onChange={(e) => {
                    setValue(id, e.value);
                    field.onChange(e.value);
                    if (onChange) {
                      onChange(e); // Call the custom onChange handler if provided
                    }
                  }}
                  checked={field.value === option.value}
                  className={className}
                />
                <label htmlFor={typeof option.value === "string" ? `${id}-${option.value}` : `${id}-${option.value.toString()}`} className="ml-2">{option.label}</label>
              </div>
            ))}
          </div>
        )}
      />
      {error && <small className="p-error">{error.message}</small>}
    </div>
  );
};

export default FormRadioButton;
