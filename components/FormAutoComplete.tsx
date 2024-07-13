import React from "react";
import { Controller } from "react-hook-form";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";

type FormAutoCompleteProps = {
  label: string;
  id: string;
  options: { label: string; value: number }[];
  search: (event: any) => void;
  field: string;
  placeholder: string;
  error?: any;
};

const FormAutoComplete: React.FC<FormAutoCompleteProps> = ({
  label,
  id,
  options,
  search,
  field,
  placeholder,
  error,
}) => {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Controller
        name={id}
        render={({ field: { onChange, value, onBlur } }) => {
          const selectedOption =
            options.find((option) => option.value === value) || null;
          return (
            <AutoComplete
              id={id}
              field={field}
              value={
                selectedOption ? selectedOption.label : !!value ? value : ""
              }
              suggestions={options}
              completeMethod={(event) => {
                search(event);
              }}
              onChange={(e) => {
                console.log(
                  "e : ",
                  e.value
                    ? e.value.value
                      ? e.value.value
                      : e.value
                    : e.target.value
                );
                onChange(
                  e.value
                    ? e.value.value
                      ? e.value.value
                      : e.value
                    : e.target.value
                );
              }}
              onBlur={() => {
                onBlur();
              }}
              dropdown
              placeholder={placeholder}
              className={classNames({ "p-invalid": !!error })}
            />
          );
        }}
      />
      {error && <small className="p-error">{error.message}</small>}
    </div>
  );
};

export default FormAutoComplete;
