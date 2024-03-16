// ErrorMessage.js
import React from "react";

const ErrorMessage = ({ error }: { error: any }) =>
  error && (
    <div>
      <small className="p-error">{error?.message}</small>
    </div>
  );

export default ErrorMessage;
