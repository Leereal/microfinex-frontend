import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import FormInput from "@/components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientSchema, ClientType } from "@/schemas/client.schema";

type ClientModalProps = {
  visible: boolean;
  onHide: () => void;
  onSubmit: SubmitHandler<FieldValues>;
  initialValues?: Partial<ClientType>;
  isSubmitting: boolean;
};

const ClientModal = ({
  visible,
  onHide,
  onSubmit,
  initialValues,
  isSubmitting,
}: ClientModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ClientSchema),
    defaultValues: initialValues,
  });

  // Clear form when hiding modal
  const handleHide = () => {
    reset();
    onHide();
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: "100%", maxWidth: "1200px" }}
      header={initialValues ? "Edit Client" : "Add Client"}
      modal
      className="p-fluid"
      onHide={handleHide}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-grid p-fluid">
        <div className="flex space-x-5">
          <div className="flex space-x-3 lg:w-1/2">
            <FormInput
              label="First Name"
              id="first_name"
              type="text"
              placeholder="First Name"
              register={register}
              error={errors.first_name}
            />
            <FormInput
              label="Last Name"
              id="last_name"
              type="text"
              placeholder="Last Name"
              register={register}
              error={errors.last_name}
            />
          </div>
          <div className="flex space-x-3 lg:w-1/2">
            <FormInput
              label="Country"
              id="country"
              type="text"
              placeholder="Country"
              register={register}
              error={errors.country}
            />
            <FormInput
              label="Email"
              id="emails"
              type="text"
              placeholder="Email"
              register={register}
              error={errors.emails}
            />
          </div>
        </div>
        <div className="flex space-x-5">
          <div className="flex space-x-3 lg:w-1/2">
            <FormInput
              label="Date of Birth"
              id="date_of_birth"
              type="text"
              placeholder="Date of Birth"
              register={register}
              error={errors.date_of_birth}
            />{" "}
            <FormInput
              label="Gender"
              id="gender"
              type="text"
              placeholder="Gender"
              register={register}
              error={errors.gender}
            />
          </div>
          <div className="flex space-x-3 lg:w-1/2">
            <FormInput
              label="National ID"
              id="national_id"
              type="text"
              placeholder="National ID"
              register={register}
              error={errors.national_id}
            />
            <FormInput
              label="Passport Number"
              id="passport_number"
              type="text"
              placeholder="Passport Number"
              register={register}
              error={errors.passport_number}
            />
          </div>
        </div>

        <div className="flex w-full">
          <FormInput
            label="Address"
            id="address"
            type="textarea"
            placeholder="Enter Full Address"
            register={register}
            error={errors.address}
          />
        </div>

        <div className="p-dialog-footer pb-0 p-col-12">
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-text"
            onClick={handleHide}
          />
          <Button
            type="submit"
            label={initialValues ? "Update" : "Save"}
            icon="pi pi-check"
            className="p-button-text"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Dialog>
  );
};

export default ClientModal;
