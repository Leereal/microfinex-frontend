import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { PermissionCheck } from "@/components/auth/PermissionCheck";
import ChargeTable from "./ChargeTable";

const ChargeList = ({ onCreate }: { onCreate: () => void }) => {
  const toolbarLeftTemplate = () => (
    <Button
      label="New Charge"
      icon="pi pi-plus"
      style={{ marginRight: ".5em" }}
      onClick={onCreate}
    />
  );

  return (
    <div className="card">
      <h3 className="font-bold text-primary-700">Charge List</h3>
      <PermissionCheck allowedPermissions={["add_charge"]}>
        <Toolbar start={toolbarLeftTemplate} />
      </PermissionCheck>

      <ChargeTable />
    </div>
  );
};

export default ChargeList;
