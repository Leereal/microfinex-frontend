"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useRef } from "react";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useLoginMutation } from "@/redux/features/authApiSlice";
import { ProgressSpinner } from "primereact/progressspinner";
import { setAuth } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import Link from "next/link";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/auth.schema";
// import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const toast = useRef<Toast | null>(null);
  const router = useRouter();
  // const searchParams = useSearchParams()
  // const urlError = searchParams.get("error") === "OAuthAccountNotLinked";
  // const [login, { isLoading, isError, isSuccess }] = useLoginMutation();
  // const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const { layoutConfig } = useContext(LayoutContext);

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );

  const getFormErrorMessage = (name: keyof LoginForm) => {
    return (
      errors[name] && (
        <div>
          <small className="p-error">{errors[name]?.message}</small>
        </div>
      )
    );
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn("credentials", {
        ...data,
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            showError("Invalid credentials. Please try again.");
            break;
          default:
            showError("Something went wrong. Please try again.");
            break;
        }
      }
    }
  };

  const showError = (errorMessage: string) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Login Failed",
        detail: errorMessage || "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const showSuccess = () => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Login Successful",
        detail: "Login successful. Let's goooo.",
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="block text-900 text-xl font-medium mb-1"
                  >
                    Email
                  </label>
                  <InputText
                    placeholder="Email address"
                    className="w-full md:w-30rem mb-3"
                    {...register("email")}
                  />
                  {getFormErrorMessage("email")}
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="block text-900 font-medium text-xl mb-2"
                  >
                    Password
                  </label>
                  <InputText
                    type="password"
                    // inputId="password"
                    placeholder="Password"
                    // toggleMask
                    className="w-full mb-3"
                    // inputClassName="w-full  md:w-30rem"
                    {...register("password")}
                  ></InputText>
                  {getFormErrorMessage("password")}
                </div>

                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                  <Link
                    href="/password-reset"
                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                    style={{ color: "var(--primary-color)" }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  className="w-full p-3 text-xl justify-center"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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

export default LoginPage;
