import React from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Controller, useFormContext } from 'react-hook-form';
import { classNames } from 'primereact/utils';

type FormPhoneInputProps = {
  label?: string;
  id: string;
  placeholder: string;
  register: any;
  error?: any;
  className?: string;
};

const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  label,
  id,
  placeholder,
  register,
  error,
  className
}) => {
  const { setValue } = useFormContext(); // Access setValue function from useFormContext

  return (
    <div className="field">
      {label &&(<label htmlFor={id}>{label}</label>)}
      <Controller
        name={id}
        control={register.control} // Assuming register is passed from useForm or FormProvider
        render={({ field }) => (
          <PhoneInput
            id={id}
            placeholder={placeholder}
            value={field.value}
            onChange={(value) => {
              setValue(id, value); // Set the selected value to form state
              field.onChange(value); // Update the field value
            }}
            className={classNames({ 'p-invalid': !!error },className)}
          />
        )}
      />
      {error && <small className="p-error">{error.message}</small>}
    </div>
  );
};

export default FormPhoneInput;