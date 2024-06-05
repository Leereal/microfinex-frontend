import React, { useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import AuditChangeTable from "./AuditChangeTable";

const AuditChangeList = ({
  auditChanges,
}: {
  auditChanges: AuditChangeType[];
}) => {
  const [deleteItems, setDeleteItems] = useState<AuditChangeType[]>([]);

  const onDelete = () => {
    // Delete items
  };
  const toolbarLeftTemplate = () => {
    if (deleteItems.length > 0) {
      return (
        <Button
          label="Delete"
          icon="pi pi-trash"
          style={{ marginRight: ".5em" }}
          onClick={onDelete}
        />
      );
    }
  };

  return (
    <div className="card">
      <h3 className="font-bold text-primary-700">Audit Changes List</h3>
      <Toolbar start={toolbarLeftTemplate} />
      <AuditChangeTable auditChanges={auditChanges} />
    </div>
  );
};

export default AuditChangeList;
