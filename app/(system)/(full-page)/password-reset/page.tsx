"use client";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useRef,
  useState,
} from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useResetPasswordMutation } from "@/redux/features/authApiSlice";
import { ProgressSpinner } from "primereact/progressspinner";
import { LayoutContext } from "@/layout/context/layoutcontext";

const LoginPage = () => {
  const toast = useRef<Toast | null>(null);
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [email, setEmail] = useState("");

  const { layoutConfig } = useContext(LayoutContext);

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      resetPassword({
        email,
      })
        .unwrap()
        .then(() => {
          showSuccess();
          setEmail("");
        })
        .catch((error: any) => {
          console.log("error", error);
          showError(
            error?.data?.non_field_errors?.[0] ||
              "Failed to send request. Please try again."
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
        summary: "Password Reset Failed",
        detail: errorMessage || "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const showSuccess = () => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Request Sent",
        detail: "Please check your email for reset link",
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
            <form onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-900 text-xl font-medium mb-1"
                >
                  Email
                </label>
                <InputText
                  id="email"
                  placeholder="Email address"
                  className="w-full  mb-3"
                  onChange={onChange}
                  value={email}
                />
                <Button
                  className="w-full p-3 text-xl justify-center"
                  type="submit"
                >
                  {isLoading ? (
                    <ProgressSpinner
                      strokeWidth="8"
                      fill="var(--surface-ground)"
                      animationDuration="1.5s"
                      className="w-8 h-8 text-white"
                    />
                  ) : (
                    <span className="text-2xl font-bold">Reset Password</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
