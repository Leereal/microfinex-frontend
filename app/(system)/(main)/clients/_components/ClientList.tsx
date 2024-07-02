import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { PermissionCheck } from "@/components/auth/PermissionCheck";
import ClientTable from "./ClientTable";

const ClientList = ({
  onCreate,
  onEdit,
}: {
  onCreate: () => void;
  onEdit: any;
}) => {
  const toolbarLeftTemplate = () => (
    <Button
      label="New Client"
      icon="pi pi-plus"
      style={{ marginRight: ".5em" }}
      onClick={onCreate}
    />
  );

  return (
    <div className="card">
      <h3 className="font-bold text-primary-700">Client List</h3>
      <PermissionCheck allowedPermissions={["add_client"]}>
        <Toolbar start={toolbarLeftTemplate} />
      </PermissionCheck>
      <ClientTable onEdit={onEdit} />
    </div>
  );
};

export default ClientList;
