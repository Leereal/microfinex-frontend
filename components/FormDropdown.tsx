import React from "react";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";

type FormDropdownProps = {
  label: string;
  id: string;
  options: any[];
  placeholder?: string;
  register: any;
  error?: {
    message: string;
  };
  showClear?: boolean;
};

const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  id,
  options,
  placeholder,
  register,
  error,
  showClear,
}) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <Dropdown
      id={id}
      options={options}
      placeholder={placeholder}
      className={classNames({ "p-invalid": !!error })}
      {...register(id)}
      showClear={showClear}
    />
    {error && <small className="p-error">{error?.message}</small>}
  </div>
);

export default FormDropdown;
