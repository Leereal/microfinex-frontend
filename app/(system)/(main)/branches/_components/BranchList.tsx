// BranchList.js
import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import BranchTable from "./BranchTable";
import { PermissionCheck } from "@/components/auth/PermissionCheck";

const BranchList = ({
  branches,
  onCreate,
  onEdit,
}: {
  branches: any;
  onCreate: () => void;
  onEdit: any;
}) => {
  const toolbarLeftTemplate = () => (
    <Button
      label="New Branch"
      icon="pi pi-plus"
      style={{ marginRight: ".5em" }}
      onClick={onCreate}
    />
  );

  return (
    <div className="card">
      <h3 className="font-bold text-primary-700">Branch List</h3>
      <PermissionCheck allowedPermissions={["add_branch"]}>
        <Toolbar start={toolbarLeftTemplate} />
      </PermissionCheck>

      <BranchTable branches={branches} onEdit={onEdit} />
    </div>
  );
};

export default BranchList;
