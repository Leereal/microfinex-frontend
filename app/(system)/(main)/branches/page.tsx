"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  useCreateBranchMutation,
  useGetBranchesQuery,
} from "@/redux/features/branchApiSlice";
import { Toast } from "primereact/toast";
import BranchList from "./_components/BranchList";
import BranchModal from "./_components/BranchModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { BranchSchema } from "@/schemas/common.schemas";
import { useForm } from "react-hook-form";
import { branchDefaultValues } from "@/constants/default.values";

const BranchesPage = () => {
  const toast = useRef<Toast | null>(null);
  const { data: branches, isError, isLoading } = useGetBranchesQuery();
  const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(BranchSchema),
    defaultValues: branchDefaultValues,
  });

  const [createBranch] = useCreateBranchMutation();

  const onSubmit = async (data: BranchType) => {
    createBranch(data)
      .unwrap()
      .then(() => {
        showSuccess();
        reset();
      })
      .catch(() => {
        showError("Failed to create branch. Please try again.");
      });
  };

  const showError = (errorMessage: string) => {
    console.log(toast.current);
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
        summary: "Branch Added",
        detail: "Branch has been added successfully.",
        life: 3000,
      });
    }
  };

  const onCreateBranch = () => {
    setVisible(true);
  };

  const onHideModal = () => {
    reset();
    setVisible(false);
  };
  useEffect(() => {
    if (isSubmitting) {
      setVisible(false);
    }
    if (isError) {
      showError("Error fetching branches");
    }
  }, [isError, isSubmitting]);

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <BranchList branches={branches} onCreate={onCreateBranch} />
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
