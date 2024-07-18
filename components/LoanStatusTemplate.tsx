import React from "react";
import { Tag } from "primereact/tag";

interface LoanStatusTemplateProps {
  status: string | number; // Accepts string or number for status
  id?: number | string;
}

const LoanStatusTemplate: React.FC<LoanStatusTemplateProps> = ({
  status,
  id,
}) => {
  status = typeof status === "string" ? status.toLowerCase() : status;
  let statusString = "";

  const getLoanSeverity = (loanStatus: string | number) => {
    switch (loanStatus) {
      case "pending":
      case 1:
        statusString = "Pending";
        return "warning";
      case "approved":
      case 2:
        statusString = "Approved";
        return "success";
      case "rejected":
      case 3:
        statusString = "Rejected";
        return "danger";
      case "active":
      case 4:
        statusString = "Active";
        return "success";
      case "default":
      case 5:
        statusString = "Default";
        return "danger";
      case "Completed":
      case 6:
        statusString = "Completed";
        return "info";
      case "overdue":
      case 7:
        statusString = "Overdue";
        return "danger";
      case "cancelled":
      case 8:
        statusString = "Cancelled";
        return "danger";
      case "failed":
      case 9:
        statusString = "Failed";
        return "danger";
      case "closed":
      case 10:
        statusString = "Closed";
        return "info";
      case "legal":
      case 11:
        statusString = "Legal";
        return "danger";
      case "bad debt":
      case 12:
        statusString = "Bad Debt";
        return "danger";
      default:
        statusString = "Unknown";
        return null;
    }
  };

  const severity = getLoanSeverity(status);

  return (
    <Tag
      value={statusString || status}
      severity={severity}
      className="capitalize"
    />
  );
};

export default LoanStatusTemplate;
