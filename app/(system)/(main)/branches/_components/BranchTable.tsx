// BranchTable.js
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { branchActiveTemplate } from "@/components/templates/templates";
import { DataTableValueArray } from "primereact/datatable";

const BranchTable = ({ branches }: { branches: DataTableValueArray }) => (
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
  </DataTable>
);

export default BranchTable;
