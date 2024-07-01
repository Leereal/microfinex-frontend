import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { branchActiveTemplate } from "@/components/templates/templates";
import { DataTableValueArray } from "primereact/datatable";
import { Button } from "primereact/button";
import { PermissionCheck } from "@/components/auth/PermissionCheck";
import { useCheckPermissions } from "@/hooks/use-check-permission";

const BranchTable = ({
  branches,
  onEdit,
}: {
  branches: DataTableValueArray;
  onEdit: (branch: any) => void;
}) => {
  const hasChangePermission = useCheckPermissions({
    allowedPermissions: ["change_branch"],
  });

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success mr-2"
        onClick={() => onEdit(rowData)}
      />
    );
  };
  return (
    <DataTable value={branches} dataKey="id">
      <Column field="name" header="Name" sortable />
      <Column field="address" header="Address" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="phone" header="Phone" sortable />
      <Column
        field="is_active"
        header="Active"
        body={branchActiveTemplate}
        sortable
      />
      {hasChangePermission && (
        <Column body={actionBodyTemplate} header="Actions" />
      )}
    </DataTable>
  );
};

export default BranchTable;
