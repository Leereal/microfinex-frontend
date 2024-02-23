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
import { LayoutContext } from "../../../../layout/context/layoutcontext";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import Link from "next/link";
import { useRegisterMutation } from "@/redux/features/authApiSlice";

import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

const RegisterPage = () => {
  const toast = useRef<Toast | null>(null);
  const router = useRouter();
  const [register, { isLoading, isError, isSuccess }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password1: "",
    password2: "",
  });
  const { firstName, lastName, email, password1, password2 } = formData;

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

    register({
      first_name: firstName,
      last_name: lastName,
      email,
      password1,
      password2,
    })
      .unwrap()
      .then(() => {
        showSuccess();
        router.push("/auth/login");
      })
      .catch(() => {
        showError();
      });
  };
  const showError = () => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Registration Failed",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };
  const showSuccess = () => {
    console.log("toast", toast.current);
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Done Registration",
        detail: "Registration successful. Please verify your email.",
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
            className="w-full surface-card py-6 px-5 sm:px-6"
            style={{ borderRadius: "53px" }}
          >
            <form onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-900 text-xl font-medium mb-1"
                >
                  First Name
                </label>
                <InputText
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  className="w-full md:w-30rem mb-3"
                  onChange={onChange}
                  value={firstName}
                  required
                />
                <label
                  htmlFor="firstName"
                  className="block text-900 text-xl font-medium mb-1"
                >
                  Last Name
                </label>
                <InputText
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="w-full md:w-30rem mb-3"
                  onChange={onChange}
                  value={lastName}
                  required
                />
                <label
                  htmlFor="email"
                  className="block text-900 text-xl font-medium mb-1"
                >
                  Email
                </label>
                <InputText
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className="w-full md:w-30rem mb-3"
                  onChange={onChange}
                  value={email}
                />
                <label
                  htmlFor="password1"
                  className="block text-900 font-medium text-xl mb-2"
                >
                  Password
                </label>
                <Password
                  inputId="password1"
                  placeholder="Password"
                  toggleMask
                  className="w-full mb-3"
                  inputClassName="w-full  md:w-30rem"
                  onChange={onChange}
                  value={password1}
                ></Password>

                <label
                  htmlFor="password2"
                  className="block text-900 font-medium text-xl mb-1"
                >
                  Confirm Password
                </label>
                <Password
                  inputId="password2"
                  placeholder="Password"
                  toggleMask
                  className="w-full mb-2"
                  inputClassName="w-full md:w-30rem"
                  onChange={onChange}
                  value={password2}
                ></Password>

                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                  <a
                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                    style={{ color: "var(--primary-color)" }}
                  >
                    Forgot password?
                  </a>
                </div>
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
                    <span className="text-2xl font-bold">Register</span>
                  )}
                </Button>
              </div>
            </form>
            <div className="mt-2">
              Already have an account?
              <Link href="/auth/login"> Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
