import React from "react";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";

type FormInputNumberProps = {
  label: string;
  id: string;
  register: any; // Assuming register is of any type
  error?: {
    message: string;
  };
  showButtons?: boolean;
  mode?: string;
};

const FormInputNumber: React.FC<FormInputNumberProps> = ({
  label,
  id,
  register,
  error,
  showButtons,
  mode,
}) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <InputNumber
      id={id}
      className={classNames({ "p-invalid": !!error })}
      {...register(id)} // Spread the register function
      showButtons={showButtons}
      mode={mode}
    />
    {error && <small className="p-error">{error?.message}</small>}
  </div>
);

export default FormInputNumber;
