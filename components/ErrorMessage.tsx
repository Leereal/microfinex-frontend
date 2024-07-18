import React, { useEffect, useRef } from "react";
import { Messages } from "primereact/messages";

interface ErrorComponentProps {
  message: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => {
  const msgs = useRef<Messages>(null);

  useEffect(() => {
    msgs.current?.clear();
    msgs.current?.show([
      { sticky: true, severity: "error", summary: "Error", detail: message },
    ]);
  }, [message]);

  return <Messages ref={msgs} />;
};

export default ErrorComponent;
