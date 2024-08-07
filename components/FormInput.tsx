// FormInput.js
import React from "react";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";

type FormInputProps = {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  register: any;
  error?: any
  className?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type,
  placeholder,
  register,
  error,
  className
}) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <InputText
      id={id}
      type={type}
      placeholder={placeholder}
      autoFocus
      className={classNames({ "p-invalid": !!error },className)}
      {...register(id)}
    />
    {error && <small className="p-error">{error?.message}</small>}
  </div>
);

export default FormInput;
