import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import LoanTable from "./LoanTable";

const LoanList = ({
  loans,
  onCreate,
}: {
  loans: LoanType[];
  onCreate: () => void;
}) => {
  const toolbarLeftTemplate = () => (
    <Button
      label="Disburse Loan"
      icon="pi pi-shopping-cart"
      style={{ marginRight: ".5em" }}
      onClick={onCreate}
    />
  );

  return (
    <div className="card">
      <h3 className="font-bold text-primary-700">Loans List</h3>
      <Toolbar start={toolbarLeftTemplate} />
      <LoanTable loans={loans} />
    </div>
  );
};

export default LoanList;
