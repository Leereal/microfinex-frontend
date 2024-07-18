import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import LoanTable from "./LoanTable";
import { PermissionCheck } from "@/components/auth/PermissionCheck";
import { useGetLoansQuery } from "@/redux/features/loanApiSlice";
import { Tooltip } from "react-tooltip";

const LoanList = ({
  onCreate,
  showError,
  waiting,
}: {
  onCreate: () => void;
  showError: any;
  waiting: boolean;
}) => {
  const { refetch } = useGetLoansQuery();
  const toolbarLeftTemplate = () => (
    <div className="flex justify-between items-center">
      <Tooltip
        anchorSelect=".disburseButton"
        content="Wait still loading data"
      />
      <Button
        label="Disburse Loan"
        icon={`disburseButton pi ${
          waiting
            ? " pi-exclamation-triangle text-red-500"
            : " pi-shopping-cart "
        }`}
        style={{ marginRight: ".5em" }}
        onClick={onCreate}
        disabled={waiting}
      />
    </div>
  );

  return (
    <div className="card">
      <h3 className="font-bold text-primary-700">Loans List</h3>
      <PermissionCheck allowedPermissions={["add_loan"]}>
        <Toolbar start={toolbarLeftTemplate} />
      </PermissionCheck>
      <LoanTable showError={showError} />
    </div>
  );
};

export default LoanList;
