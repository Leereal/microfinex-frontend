"use client";
import React, { useRef, useState } from "react";
import { auth } from "@/auth";
import {
  useCreateBranchMutation,
  useGetBranchesQuery,
} from "@/redux/features/branchApiSlice";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { DataTable, DataTableValueArray } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BranchSchema } from "@/schemas/common.schemas";
import { branchDefaultValues } from "@/constants/default.values";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";

const BranchesPage = () => {
  const toast = useRef<Toast | null>(null);
  const { data: branches, isError, isLoading } = useGetBranchesQuery({});
  const [
    createBranch,
    { isLoading: createLoading, isError: createError, isSuccess },
  ] = useCreateBranchMutation();
  const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BranchType>({
    resolver: zodResolver(BranchSchema),
    defaultValues: branchDefaultValues,
  });

  const onSubmit = async (data: BranchType) => {
    reset();
    createBranch(data)
      .unwrap()
      .then(() => {
        showSuccess();
      })
      .catch(() => {
        showError("Failed to create branch. Please try again.");
      });
  };
  const showError = (errorMessage: string) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Fetch Branches Failed",
        detail: errorMessage || "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };
  const showSuccess = () => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Branch  Added",
        detail: "Branch has been added successfully.",
        life: 3000,
      });
    }
  };

  if (isError) {
    showError("Error fetching branches");
  }

  const toolbarLeftTemplate = () => {
    return (
      <>
        <Button
          label="New Branch"
          icon="pi pi-plus"
          style={{ marginRight: ".5em" }}
          onClick={() => setVisible(true)}
        />
      </>
    );
  };
  const activeTemplate = (rowData: BranchType) => {
    return <span className="">{rowData.is_active ? "Active" : "Closed"}</span>;
  };

  const modalFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setVisible(false)}
      />
      <Button
        type="submit"
        label="Save"
        icon="pi pi-check"
        text
        disabled={isSubmitting}
      />
    </>
  );
  const getFormErrorMessage = (name: keyof BranchType) => {
    return (
      errors[name] && (
        <div>
          <small className="p-error">{errors[name]?.message}</small>
        </div>
      )
    );
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <h3 className="font-bold text-primary-700">Branch List</h3>
          <Toolbar start={toolbarLeftTemplate}></Toolbar>
          <DataTable value={branches as DataTableValueArray} dataKey="id">
            <Column field="name" header="Name" sortable />
            <Column field="address" header="Address" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="phone" header="Phone" sortable />
            <Column
              field="is_active"
              header="Active"
              body={activeTemplate}
              sortable
            />
            <Column
              field="status"
              header="Status"
              body={activeTemplate}
              sortable
            ></Column>
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={visible}
        style={{ width: "450px" }}
        header="Branch"
        modal
        className="p-fluid"
        onHide={() => setVisible(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              type="text"
              placeholder="Name"
              autoFocus
              className={classNames({
                "p-invalid": !!errors["name"],
              })}
              {...register("name")}
            />
            {getFormErrorMessage("name")}
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="text"
              placeholder="Email"
              className={classNames({
                "p-invalid": !!errors["email"],
              })}
              {...register("email")}
            />
            {getFormErrorMessage("email")}
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <InputText
              id="phone"
              type="text"
              placeholder="Phone"
              className={classNames({
                "p-invalid": !!errors["phone"],
              })}
              {...register("phone")}
            />
            {getFormErrorMessage("phone")}
          </div>
          <div className="field">
            <label htmlFor="address">Address</label>
            <InputTextarea
              id="address"
              placeholder="Enter Full Address"
              rows={3}
              cols={20}
              {...register("address")}
            />
            {getFormErrorMessage("address")}
          </div>
          <div className="p-dialog-footer pb-0">
            <Button
              label="Cancel"
              icon="pi pi-times"
              text
              onClick={(e) => {
                e.preventDefault();
                reset();
                setVisible(false);
              }}
            />
            <Button
              type="submit"
              label="Save"
              icon="pi pi-check"
              text
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default BranchesPage;
