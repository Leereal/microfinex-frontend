"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  useCreateBranchMutation,
  useGetBranchesQuery,
  useUpdateBranchMutation,
} from "@/redux/features/branchApiSlice";
import { Toast } from "primereact/toast";
import BranchList from "./_components/BranchList";
import BranchModal from "./_components/BranchModal";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BranchSchema,
  BranchType,
  branchDefaultValues,
} from "@/schemas/branch.schemas";
import { useForm } from "react-hook-form";
// import { branchDefaultValues } from "@/constants/default.values";// We no longer use this since we are suing zod-defaults package

const BranchesPage = () => {
  const toast = useRef<Toast | null>(null);
  const { data: branches, isError, isLoading } = useGetBranchesQuery();
  const [createBranch, { isLoading: isSubmitting }] = useCreateBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();

  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<BranchType | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(BranchSchema),
    defaultValues: branchDefaultValues,
  });

  const onSubmit = async (data: BranchType) => {
    if (editMode && currentBranch) {
      if (currentBranch.id === undefined) {
        showError("Branch ID is missing. Cannot update branch.");
        return;
      }
      updateBranch({ id: currentBranch.id, ...data })
        .unwrap()
        .then(() => {
          showSuccess("Branch updated successfully.");
          reset();
          setVisible(false);
          setEditMode(false);
          setCurrentBranch(null);
        })
        .catch((error: any) => {
          if (error.data) {
            Object.keys(error.data).forEach((field) => {
              setError(field as keyof BranchType, {
                type: "manual",
                message: error.data[field][0],
              });
            });
          } else {
            showError("Failed to update branch. Please try again.");
          }
        });
    } else {
      createBranch(data)
        .unwrap()
        .then(() => {
          showSuccess("Branch added successfully.");
          reset();
          setVisible(false);
        })
        .catch((error: any) => {
          if (error.data) {
            Object.keys(error.data).forEach((field) => {
              setError(field as keyof BranchType, {
                type: "manual",
                message: error.data[field][0],
              });
            });
          } else {
            showError("Failed to create branch. Please try again.");
          }
        });
    }
  };

  const showError = (errorMessage: string) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Operation Failed",
        detail: errorMessage || "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const showSuccess = (successMessage: string) => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Operation Successful",
        detail: successMessage,
        life: 3000,
      });
    }
  };

  const onCreateBranch = () => {
    reset(branchDefaultValues);
    setVisible(true);
    setEditMode(false);
    setCurrentBranch(null);
  };

  const onEditBranch = (branch: BranchType) => {
    setCurrentBranch(branch);
    reset(branch);
    setVisible(true);
    setEditMode(true);
  };

  const onHideModal = () => {
    reset();
    setVisible(false);
    setEditMode(false);
    setCurrentBranch(null);
  };
  useEffect(() => {
    if (isError) {
      showError("Error fetching branches");
    }
  }, [isError]);

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <BranchList
          branches={branches}
          onCreate={onCreateBranch}
          onEdit={onEditBranch}
        />
      </div>
      <BranchModal
        visible={visible}
        onHide={onHideModal}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default BranchesPage;
