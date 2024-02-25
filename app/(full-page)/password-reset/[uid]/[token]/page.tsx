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
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useResetPasswordConfirmMutation } from "@/redux/features/authApiSlice";
import { ProgressSpinner } from "primereact/progressspinner";
import { z } from "zod";
import { useAppDispatch } from "@/redux/hooks";
import { LayoutContext } from "@/layout/context/layoutcontext";

interface PasswordResetConfirmProps {
  params: {
    uid: string;
    token: string;
  };
}
const PasswordResetConfirm = ({ params }: PasswordResetConfirmProps) => {
  const toast = useRef<Toast | null>(null);
  const router = useRouter();
  const [resetPasswordConfirm, { isLoading }] =
    useResetPasswordConfirmMutation();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = formData;

  const { layoutConfig } = useContext(LayoutContext);

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData({ ...formData, [id]: value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const schema = z.object({
      new_password1: z.string().min(8),
      new_password2: z.string().min(8),
    });

    const { uid, token } = params;

    try {
      schema.parse(formData);
      resetPasswordConfirm({
        uid,
        token,
        new_password1,
        new_password2,
      })
        .unwrap()
        .then(() => {
          showSuccess();
          router.push("/auth/login");
        })
        .catch((error: any) => {
          console.log("error", error);
          showError(
            error?.data?.non_field_errors?.[0] || "Password reset failed."
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
        summary: "Password Reset Successful",
        detail: "Password was reset successfully. Please login.",
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
                  htmlFor="new_password1"
                  className="block text-900 font-medium text-xl mb-2"
                >
                  New Password
                </label>
                <Password
                  inputId="new_password1"
                  placeholder="New Password"
                  toggleMask
                  className="w-full mb-3"
                  inputClassName="w-full  md:w-30rem"
                  onChange={onChange}
                  value={new_password1}
                ></Password>
                <label
                  htmlFor="password"
                  className="block text-900 font-medium text-xl mb-2"
                >
                  Password
                </label>
                <Password
                  inputId="new_password2"
                  placeholder="Confirm New Password"
                  toggleMask
                  className="w-full mb-3"
                  inputClassName="w-full  md:w-30rem"
                  onChange={onChange}
                  value={new_password2}
                ></Password>
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
                    <span className="text-2xl font-bold">Login</span>
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

export default PasswordResetConfirm;
