// BranchList.js
import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import BranchTable from "./BranchTable";

const BranchList = ({
  branches,
  onCreate,
}: {
  branches: any;
  onCreate: any;
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
      <Toolbar start={toolbarLeftTemplate} />
      <BranchTable branches={branches} />
    </div>
  );
};

export default BranchList;
