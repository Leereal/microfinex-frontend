import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import RepaymentTable from "../../repayments/_components/RepaymentTable";
import { PermissionCheck } from "@/components/auth/PermissionCheck";

const RepaymentList = ({
  onCreate,
  showError,
}: {
  onCreate: () => void;
  showError: any;
}) => {
  const toolbarLeftTemplate = () => (
    <Button
      label="Make Payment"
      icon="pi pi-money-bill"
      style={{ marginRight: ".5em" }}
      onClick={onCreate}
    />
  );

  return (
    <div className="card">
      <h3 className="font-bold text-primary-700">Repayments List</h3>
      <PermissionCheck allowedPermissions={["add_loan"]}>
        <Toolbar start={toolbarLeftTemplate} />
      </PermissionCheck>
      <RepaymentTable showError={showError} />
    </div>
  );
};

export default RepaymentList;
