"use client";
import { useRouter } from "next/navigation";
import React, { FormEvent, useContext, useRef, useState } from "react";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import {
  useRetrieveUserQuery,
  useSwitchBranchMutation,
} from "@/redux/features/authApiSlice";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { useSession } from "next-auth/react";
const SwitchPage = () => {
  const toast = useRef<Toast | null>(null);
  const router = useRouter();
  const { data: session, update } = useSession();

  const [switchBranch, { isLoading }] = useSwitchBranchMutation();
  const [branch, setBranch] = useState<Branch>();

  const { layoutConfig } = useContext(LayoutContext);

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );

  const changeBranch = (selectedBranch: Branch) => {
    setBranch(selectedBranch);
    try {
      switchBranch({
        branch: selectedBranch.id,
      })
        .unwrap()
        .then(async () => {
          await update({
            ...session,
            user: {
              ...session?.user,
              active_branch: selectedBranch.id,
            },
          });
          showSuccess();
          router.push("/dashboard");
        })
        .catch((error: any) => {
          console.log("error", error);
          showError(
            error?.data?.non_field_errors?.[0] ||
              "Failed switch branch. Please try again."
          );
        });
    } catch (error: any) {
      console.log("validation error", error);
      showError(
        error.errors?.[0]?.message ||
          "Validation failed. Please check your inputs."
      );
    }
  };

  const showError = (errorMessage: string) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Switch Branch Failed",
        detail: errorMessage || "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const showSuccess = () => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Branch Switched",
        detail: "Branch was switched successfully.",
        life: 3000,
      });
    }
  };

  return (
    <div className={containerClassName}>
      <Toast ref={toast} />
      <div className="flex flex-column align-items-center justify-content-center">
        <img
          src={`/logo-${
            layoutConfig.colorScheme === "light" ? "dark" : "white"
          }.png`}
          alt="Microfinex logo"
          className="mb-5 w-9rem flex-shrink-0"
        />
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8"
            style={{ borderRadius: "53px" }}
          >
            <div>
              <label
                htmlFor="branch"
                className="block text-900 text-xl font-medium mb-1"
              >
                Choose Branch
              </label>
              <Dropdown
                value={branch}
                onChange={(e) => changeBranch(e.value)}
                options={session?.user?.branches}
                optionLabel="name"
                placeholder="Select Branch"
                className="w-full  mb-6"
              />
              {isLoading && (
                <div className="flex justify-center">
                  <ProgressSpinner
                    strokeWidth="8"
                    fill="var(--surface-ground)"
                    animationDuration="1.5s"
                    className="w-8 h-8 text-white"
                  />
                </div>
              )}
            </div>
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
};

export default SwitchPage;
