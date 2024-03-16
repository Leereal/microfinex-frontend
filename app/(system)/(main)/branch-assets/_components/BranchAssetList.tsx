// BranchList.js
import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import BranchAssetTable from "./BranchAssetTable";

const BranchAssetList = ({
  branchAssets,
  onCreate,
}: {
  branchAssets: any;
  onCreate: any;
}) => {
  const toolbarLeftTemplate = () => (
    <Button
      label="New Branch Asset"
      icon="pi pi-plus"
      style={{ marginRight: ".5em" }}
      onClick={onCreate}
    />
  );

  return (
    <div className="card">
      <h3 className="font-bold text-primary-700">Branch Assets List</h3>
      <Toolbar start={toolbarLeftTemplate} />
      <BranchAssetTable branchAssets={branchAssets} />
    </div>
  );
};

export default BranchAssetList;
