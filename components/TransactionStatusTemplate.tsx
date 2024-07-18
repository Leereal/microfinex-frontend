import React from "react";
import { Tag } from "primereact/tag";

interface TransactionStatusTemplateProps {
  status: string;
}

const TransactionStatusTemplate: React.FC<TransactionStatusTemplateProps> = ({
  status,
}) => {
  const getTransactionSeverity = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "cancelled":
      case "refunded":
        return "danger";
      default:
        return null;
    }
  };

  const severity = getTransactionSeverity(status);

  return <Tag value={status} severity={severity} className="capitalize" />;
};

export default TransactionStatusTemplate;
