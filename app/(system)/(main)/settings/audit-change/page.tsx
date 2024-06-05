"use client";
import { useGetAuditChangesQuery } from "@/redux/features/auditChangeApiSlice";
import { Toast } from "primereact/toast";
import React, { useRef } from "react";
import AuditChangeList from "./_components/AuditChangeList";

const AuditChangePage = () => {
  const { data: auditChanges } = useGetAuditChangesQuery();
  const toast = useRef<Toast | null>(null);

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        {auditChanges && !!auditChanges.length && (
          <AuditChangeList auditChanges={auditChanges} />
        )}
      </div>
    </div>
  );
};

export default AuditChangePage;
