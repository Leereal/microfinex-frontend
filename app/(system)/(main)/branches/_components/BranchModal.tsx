// BranchModal.js
import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import FormInput from "@/components/FormInput";

type BranchModalProps = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  register: any;
  errors: any;
  isSubmitting: boolean;
};

const BranchModal = ({
  visible,
  onHide,
  onSubmit,
  register,
  errors,
  isSubmitting,
}: BranchModalProps) => (
  <Dialog
    visible={visible}
    style={{ width: "450px" }}
    header="Branch"
    modal
    className="p-fluid"
    onHide={onHide}
  >
    <form onSubmit={onSubmit}>
      <FormInput
        label="Name"
        id="name"
        type="text"
        placeholder="Name"
        register={register}
        error={errors.name}
      />
      <FormInput
        label="Email"
        id="email"
        type="text"
        placeholder="Email"
        register={register}
        error={errors.email}
      />
      <FormInput
        label="Phone"
        id="phone"
        type="text"
        placeholder="Phone"
        register={register}
        error={errors.phone}
      />
      <FormInput
        label="Address"
        id="address"
        type="textarea"
        placeholder="Enter Full Address"
        register={register}
        error={errors.address}
      />
      <div className="p-dialog-footer pb-0">
        <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
        <Button
          type="submit"
          label="Save"
          icon="pi pi-check"
          text
          disabled={isSubmitting}
        />
      </div>
    </form>
  </Dialog>
);

export default BranchModal;
