import React from "react";
import { classNames } from "primereact/utils";
import { Calendar } from "primereact/calendar";

type FormCalendarProps = {
  label: string;
  id: string;
  register: any;
  error?: {
    message: string;
  };
  showIcon?: boolean;
};

const FormCalendar: React.FC<FormCalendarProps> = ({
  label,
  id,
  register,
  error,
}) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <Calendar
      id={id}
      className={classNames({ "p-invalid": !!error })}
      {...register(id)}
      showIcon
    />
    {error && <small className="p-error">{error?.message}</small>}
  </div>
);

export default FormCalendar;
