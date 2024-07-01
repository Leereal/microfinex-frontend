import { BranchType } from "@/schemas/branch.schemas";
import React from "react";

export const branchActiveTemplate = (rowData: BranchType) => {
  return <span className="">{rowData.is_active ? "Active" : "Closed"}</span>;
};
