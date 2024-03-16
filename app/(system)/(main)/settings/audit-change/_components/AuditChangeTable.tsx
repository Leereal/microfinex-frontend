// BranchTable.js
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { branchActiveTemplate } from "@/components/templates/templates";
import { DataTableValueArray } from "primereact/datatable";

const AuditChangeTable = ({
  auditChanges,
}: {
  auditChanges: DataTableValueArray;
}) => (
  <DataTable value={auditChanges} dataKey="id">
    <Column field="id" header="ID" sortable />
    <Column field="user" header="User" sortable />
    <Column field="model_name" header="Model Name" sortable />
    <Column field="record_id" header="Record ID" sortable />
    <Column field="field_name" header="Field Name" sortable />
    <Column field="old_value" header="Old Value" />
    <Column field="new_value" header="New Value" />
    <Column field="action" header="Action" sortable />
    <Column field="created_at" header="Created At" sortable />
    <Column field="last_modified" header="Last Modified" sortable />
  </DataTable>
);

export default AuditChangeTable;
