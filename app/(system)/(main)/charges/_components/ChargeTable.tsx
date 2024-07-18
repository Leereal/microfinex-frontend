import React, { useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Messages } from "primereact/messages";
import { useGetChargesQuery } from "@/redux/features/chargeApiSlice";
import { useCheckPermissions } from "@/hooks/use-check-permission";
import { useMountEffect } from "primereact/hooks";
import { ChargeType } from "@/schemas/charge.schema";
import CustomTooltip from "@/components/CustomTooltip";
import chargeModeTemplate from "./ChargeModeTemplate";
import LoanStatusTemplate from "@/components/LoanStatusTemplate";

const ChargeTable = () => {
  const { data: charges, isLoading, isError } = useGetChargesQuery();
  const msgs = useRef<any>(null);

  const hasChangePermission = useCheckPermissions({
    allowedPermissions: ["change_charge"],
  });

  useMountEffect(() => {
    if (isError && msgs.current) {
      msgs.current.clear();
      msgs.current.show({
        id: "1",
        sticky: true,
        severity: "error",
        summary: "Error",
        detail: "Error loading charges. Please try again later.",
        closable: true,
      });
    }
  });

  const actionBodyTemplate = (rowData: ChargeType) => (
    <Button
      icon="pi pi-pencil"
      className="p-button-rounded p-button-success mr-2"
      onClick={() => {}}
    />
  );

  const descriptionBodyTemplate = (rowData: any) => (
    <>
      <CustomTooltip
        targetSelector={`.description-${rowData.id}`}
        content={rowData.description}
      />
      <div
        className={`description-${rowData.id} max-w-xs truncate cursor-pointer`}
      >
        {rowData.description}
      </div>
    </>
  );

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

      <DataTable value={charges} dataKey="id">
        <Column field="name" header="Name" sortable />
        <Column
          field="description"
          header="Description"
          sortable
          body={descriptionBodyTemplate}
        />
        <Column field="amount" header="Amount" sortable />
        <Column
          field="amount_type"
          header="Amount Type"
          className="capitalize"
          sortable
        />
        <Column
          field="charge_type"
          header="Charge Type"
          className="capitalize"
          sortable
        />
        <Column
          field="charge_application"
          header="Charge Application"
          className="capitalize"
          sortable
        />
        <Column
          field="loan_status"
          header="Loan Status"
          body={(rowData) => (
            <LoanStatusTemplate status={rowData.loan_status} id={rowData.id} />
          )}
          sortable
        />
        <Column field="mode" header="Mode" body={chargeModeTemplate} sortable />
        <Column
          field="is_active"
          header="Active"
          className="capitalize"
          sortable
        />
        {hasChangePermission && (
          <Column body={actionBodyTemplate} header="Actions" />
        )}
      </DataTable>
    </>
  );
};

export default ChargeTable;
