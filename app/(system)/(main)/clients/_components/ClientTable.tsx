import React, { useState, useEffect, useRef, MouseEvent } from "react";
import {
  DataTable,
  DataTableFilterMeta,
  DataTableRowEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useCheckPermissions } from "@/hooks/use-check-permission";
import {
  useDeleteClientMutation,
  useGetClientsQuery,
} from "@/redux/features/clientApiSlice";
import { ProgressSpinner } from "primereact/progressspinner";
import { Messages } from "primereact/messages";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useMountEffect } from "primereact/hooks";
import { ClientType } from "@/schemas/client.schema";
import { classNames } from "primereact/utils";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { formatDate } from "@/utils/helpers";
import { ContextMenu } from "primereact/contextmenu";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //Add individual column filters here if needed
};

const ClientTable = ({ onEdit }: { onEdit: (client: ClientType) => void }) => {
  const { data: clients, isLoading, isError } = useGetClientsQuery();
  const [
    deleteClient,
    { isLoading: isDeleting, isError: isDeleteError, isSuccess },
  ] = useDeleteClientMutation();
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [selectedClients, setSelectedClients] = useState<ClientType[]>([]);
  const msgs = useRef<Messages>(null);
  const dt = useRef<DataTable<ClientType[]> | null>(null);
  const cm = useRef<ContextMenu>(null);

  const menuModel = [
    {
      label: "Delete",
      icon: "pi pi-fw pi-times",
      command: () => deleteSelectedClients(),
    },
  ];
  const hasChangePermission = useCheckPermissions({
    allowedPermissions: ["change_client"],
  });

  const defaultColumns = [
    { field: "full_name", header: "Name" },
    { field: "email", header: "Email" },
    { field: "phone", header: "Phone" },
    { field: "date_of_birth", header: "Date of Birth" },
    { field: "national_id", header: "National ID" },
    { field: "client_limit.max_loan", header: "Max Loan" },
  ];

  const columns = [
    ...defaultColumns,
    { field: "nationality", header: "Nationality" },
    { field: "passport_number", header: "Passport Number" },
    { field: "gender", header: "Gender" },
    { field: "street_number", header: "Street Number" },
    { field: "suburb", header: "Suburb" },
    { field: "zip_code", header: "Zip Code" },
    { field: "city", header: "City" },
    { field: "state", header: "State" },
    { field: "employer.name", header: "Employer Name" },
    { field: "employer.job_title", header: "Job Title" },
    { field: "employer.employment_date", header: "Employment Date" },
    { field: "client_limit.credit_score", header: "Credit Score" },
    { field: "client_limit.currency", header: "Currency" },
    { field: "created_at", header: "Created At" },
    { field: "last_modified", header: "Last Modified" },
    { field: "age", header: "Age" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);

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

  const onColumnToggle = (event: MultiSelectChangeEvent) => {
    const selectedColumns = event.value as typeof columns;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol: any) => sCol.field === col.field)
    );

    setVisibleColumns(orderedSelectedColumns);
  };
  const initFilters = () => {
    setGlobalFilterValue("");
  };
  const actionBodyTemplate = (rowData: ClientType) => {
    return (
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success mr-2"
        onClick={() => onEdit(rowData)}
      />
    );
  };
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const exportColumns = visibleColumns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportCSV = (selectionOnly: boolean) => {
    dt.current?.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();
        // Create the table structure for autoTable
        const headers = exportColumns.map((col) => col.title);
        const body = clients?.map((client) =>
          exportColumns.map((col) => (client as any)[col.dataKey])
        );

        // Use autoTable to generate the table in the PDF
        (doc as any).autoTable({
          head: [headers],
          body: body,
        });

        doc.save("clients.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(clients || []);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "clients");
    });
  };

  const saveAsExcelFile = (buffer: any, fileName: any) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
        );
      }
    });
  };

  const deleteSelectedClients = async () => {
    try {
      for (const client of selectedClients) {
        await deleteClient(client.id!);
      }
      msgs.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Clients Deleted",
        life: 3000,
      });
      setSelectedClients([]);
    } catch (error) {
      msgs.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete clients",
        life: 3000,
      });
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <div className="flex justify-content-start">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </IconField>
        </div>
        <div className="flex align-items-center justify-content-end gap-2">
          <Button
            type="button"
            icon="pi pi-file"
            rounded
            onClick={() => exportCSV(false)}
            data-pr-tooltip="CSV"
          />
          <Button
            type="button"
            icon="pi pi-file-excel"
            severity="success"
            rounded
            onClick={exportExcel}
            data-pr-tooltip="XLS"
          />
          <Button
            type="button"
            icon="pi pi-file-pdf"
            severity="warning"
            rounded
            onClick={exportPdf}
            data-pr-tooltip="PDF"
          />
        </div>
      </div>
    );
  };
  useEffect(() => {
    initFilters();
  }, []);
  const activeBodyTemplate = (rowData: ClientType) => {
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": rowData.is_active,
          "text-red-500 pi-times-circle": !rowData.is_active,
        })}
      ></i>
    );
  };

  const onRightClick = (event: React.MouseEvent): void => {
    if (cm.current) {
      cm.current.show(event);
    }
  };

  const renderColumns = () => {
    return visibleColumns.map((col) => {
      switch (col.field) {
        case "phone":
          return (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              body={(rowData) => {
                const primaryPhone = rowData.contacts.find(
                  (contact: any) => contact.is_primary
                );
                return primaryPhone ? primaryPhone.phone : "";
              }}
            />
          );
        case "created_at":
        case "last_modified":
        case "date_of_birth":
          return (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              body={(rowData) => {
                return formatDate(rowData[col.field]);
              }}
              sortable
            />
          );
        default:
          return (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              sortable
            />
          );
      }
    });
  };

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
      <div className="card">
        <MultiSelect
          value={visibleColumns}
          options={columns}
          optionLabel="header"
          onChange={onColumnToggle}
          className="w-full sm:w-20rem mb-3"
          display="chip"
        />
        <ContextMenu
          model={menuModel}
          ref={cm}
          onHide={() => setSelectedClients([])}
        />
        <DataTable
          ref={dt}
          value={clients}
          dataKey="id"
          stripedRows
          paginator
          rows={5}
          rowsPerPageOptions={[10, 50, 100, 200, 500]}
          onContextMenu={(e: DataTableRowEvent) => {
            onRightClick(e.originalEvent as MouseEvent);
          }}
          contextMenuSelection={selectedClients}
          onContextMenuSelectionChange={(e) => {
            // No action needed here to prevent unintended deselection
          }}
          selectionMode="checkbox"
          selection={selectedClients}
          onSelectionChange={(e) => setSelectedClients(e.value)}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          header={renderHeader()}
          filters={filters}
          globalFilterFields={[
            "full_name",
            "email",
            "phone",
            "national_id",
            "street_number",
          ]}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          {renderColumns()}
          <Column
            field="is_active"
            header="Active"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "8rem" }}
            body={activeBodyTemplate}
            filter
          />

          {hasChangePermission && (
            <Column body={actionBodyTemplate} header="Actions" />
          )}
        </DataTable>
      </div>
    </>
  );
};

export default ClientTable;
