// BranchModal.js
import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import FormInput from "@/components/FormInput";

type BranchAssetModalProps = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  register: any; // Replace with the appropriate type for the register function
  errors: any; // Replace with the appropriate type for the errors object
  isSubmitting: boolean;
};

const BranchAssetModal = ({
  visible,
  onHide,
  onSubmit,
  register,
  errors,
  isSubmitting,
}: BranchAssetModalProps) => (
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
        label="Item"
        id="item"
        type="text"
        placeholder="Item Name"
        {...register("item")}
        error={errors.item?.message}
      />
      <FormInput
        label="Description"
        id="description"
        type="textarea"
        placeholder="Description"
        {...register("description")}
        error={errors.description?.message}
      />
      <FormInput
        label="Brand"
        id="brand"
        type="text"
        placeholder="Brand"
        {...register("brand")}
        error={errors.brand?.message}
      />
      <FormInput
        label="Color"
        id="color"
        type="text"
        placeholder="Color"
        {...register("color")}
        error={errors.color?.message}
      />
      <FormInput
        label="Quantity"
        id="quantity"
        type="number"
        placeholder="Quantity"
        {...register("quantity")}
        error={errors.quantity?.message}
      />
      <FormInput
        label="Purchase Date"
        id="purchaseDate"
        type="date"
        placeholder="Purchase Date"
        {...register("purchaseDate")}
        error={errors.purchaseDate?.message}
      />
      {/* Assuming you have a component for file upload or handling multiple images */}
      {/* <FormUpload
        label="Images"
        id="images"
        {...register("images")}
        error={errors.images?.message}
        // Additional props depending on how you handle file uploads
      /> */}
      <div className="p-dialog-footer pb-0">
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-text"
          onClick={onHide}
        />
        <Button
          type="submit"
          label="Save"
          icon="pi pi-check"
          className="p-button-text"
          disabled={isSubmitting}
        />
      </div>
    </form>
  </Dialog>
);

export default BranchAssetModal;
