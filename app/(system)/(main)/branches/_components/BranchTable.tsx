import React, { useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { branchActiveTemplate } from "@/components/templates/templates";
import { DataTableValueArray } from "primereact/datatable";
import { Button } from "primereact/button";
import { useCheckPermissions } from "@/hooks/use-check-permission";
import { ProgressSpinner } from "primereact/progressspinner";
import { useGetBranchesQuery } from "@/redux/features/branchApiSlice";
import { useMountEffect } from "primereact/hooks";
import { Messages } from "primereact/messages";

const BranchTable = ({ onEdit }: { onEdit: (branch: any) => void }) => {
  const { data: branches, isLoading, isError } = useGetBranchesQuery();
  const msgs = useRef<any>(null);

  const hasChangePermission = useCheckPermissions({
    allowedPermissions: ["change_branch"],
  });

  useMountEffect(() => {
    if (isError && msgs.current) {
      msgs.current.clear();
      msgs.current.show({
        id: "1",
        sticky: true,
        severity: "error",
        summary: "Error",
        detail: "Error loading clients. Please try again later.",
        closable: true,
      });
    }
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
  useMountEffect(() => {
    if (isError && msgs.current) {
      msgs.current.clear();
      msgs.current.show({
        id: "1",
        sticky: true,
        severity: "error",
        summary: "Error",
        detail: "Error loading clients. Please try again later.",
        closable: true,
      });
    }
  });
  if (isLoading) {
    return (
      <div className="card flex justify-center">
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </div>
    );
  }
  return (
    <>
      <Messages ref={msgs} />
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
    </>
  );
};

export default BranchTable;
