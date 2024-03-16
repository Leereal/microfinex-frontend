"use client";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { BranchSchema } from "@/schemas/common.schemas";
import { useForm } from "react-hook-form";
import { branchDefaultValues } from "@/constants/default.values";
import BranchAssetList from "./_components/BranchAssetList";
import BranchAssetModal from "./_components/BranchAssetModal";
import {
  useCreateBranchAssetMutation,
  useGetBranchAssetsQuery,
} from "@/redux/features/branchAssetApiSlice";

const BranchesPage = () => {
  const toast = useRef<Toast | null>(null);
  const { data: branchAssets, isError, isLoading } = useGetBranchAssetsQuery();
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

  const [createBranchAsset] = useCreateBranchAssetMutation();

  const onSubmit = async (data: BranchAssetType) => {
    createBranchAsset(data)
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
        <BranchAssetList
          branchAssets={branchAssets}
          onCreate={onCreateBranch}
        />
      </div>
      <BranchAssetModal
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
