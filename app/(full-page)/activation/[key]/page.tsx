"use client";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useVerifyMutation } from "@/redux/features/authApiSlice";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

interface Props {
  params: {
    key: string;
  };
}

const ActivationPage = ({ params }: Props) => {
  const toast = useRef<Toast | null>(null);
  const router = useRouter();

  const [verify] = useVerifyMutation();

  const showError = () => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Verification Failed",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };
  const showSuccess = () => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Done Verification",
        detail: "Your email was verified successfully",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    const { key } = params;

    verify({ key: decodeURIComponent(key) })
      .unwrap()
      .then(() => {
        showSuccess();
      })
      .catch(() => {
        showError();
      })
      .finally(() => {
        router.push("/auth/login");
      });
  }, []);

  return (
    <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <Toast ref={toast} />
      <div className="flex flex-column align-items-center justify-content-center">
        <img
          src="/logo-white.png"
          alt="Microfinex logo"
          className="mb-5 w-6rem flex-shrink-0"
        />
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
            style={{ borderRadius: "53px" }}
          >
            <div
              className="flex justify-content-center align-items-centerborder-circle"
              style={{ height: "3.2rem", width: "3.2rem" }}
            >
              <ProgressSpinner
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration="1.5s"
                className="w-8 h-8 text-white"
              />
            </div>
            <h1 className="text-900 font-bold text-5xl mb-2">
              Activating your account...{" "}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
