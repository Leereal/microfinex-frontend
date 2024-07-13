import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientDefaultValues,
  ClientSchema,
  ClientType,
} from "@/schemas/client.schema";
import PersonalInfoForm from "../forms/PersonalInfoForm";
import ContactForm from "../forms/ContactForm";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { useCreateClientMutation } from "@/redux/features/clientApiSlice";
import AddressInfoForm from "../forms/AddressInfoForm";
import NextOfKinForm from "../forms/NextOfKinForm";
import EmployerForm from "../forms/EmployerForm";
import ClientLimitForm from "../forms/ClientLimitForm";

type ClientModalProps = {
  visible: boolean;
  onHide: () => void;
  initialValues?: ClientType;
  showError: (errorMessage: string) => void;
};

const ClientModal = ({
  visible,
  onHide,
  initialValues,
  showError,
}: ClientModalProps) => {
  const {
    data: currencies,
    isError: isCurrenciesError,
    isLoading: isCurrenciesLoading,
  } = useGetCurrenciesQuery();

  const [createClient, { isLoading }] = useCreateClientMutation();

  const form = useForm({
    resolver: zodResolver(ClientSchema),
    defaultValues: initialValues || clientDefaultValues,
  });

  const { register, handleSubmit, reset, watch, setError, formState: { errors } } = form;

  const onSubmit: SubmitHandler<ClientType> = async (data) => {
    try {
      const result = await createClient(data).unwrap();
      // Handle success if needed
      onHide();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to save client. Please try again.";
      showError(errorMessage);
      if (error.data) {
        Object.keys(error.data).forEach((field) => {
          setError(field as keyof ClientType, {
            type: "manual",
            message: error.data[field][0],
          });
        });
      }
    }
  };

  const handleHide = () => {
    reset();
    onHide();
  };

  useEffect(() => {
    const subscription = watch((value) => {
      console.log("Form Data Changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Dialog
      visible={visible}
      style={{ width: "100%", maxWidth: "720px" }}
      header={initialValues ? "Edit Client" : "Add Client"}
      modal
      className="p-fluid"
      onHide={handleHide}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-grid p-fluid">
          <PersonalInfoForm />
          <AddressInfoForm/>
          <ContactForm />
        <NextOfKinForm/>
          <EmployerForm/>
          {currencies && currencies.length && (
           <ClientLimitForm currencies={currencies} />
          )}
          <div className="p-dialog-footer pb-0">
          <Button label="Cancel" icon="pi pi-times" text onClick={handleHide} />
            <Button
              label={initialValues ? "Update" : "Save"}
              icon="pi pi-check"
              text
              type="submit"
              loading={isLoading}
            />
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ClientModal;


