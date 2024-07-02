"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  useCreateClientMutation,
  useUpdateClientMutation,
} from "@/redux/features/clientApiSlice"; // Adjust import path for client API slice
import { Toast } from "primereact/toast";
import ClientList from "./_components/ClientList"; // Adjust component imports as needed
import ClientModal from "./_components/ClientModal"; // Adjust component imports as needed
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import {
  ClientSchema,
  ClientType,
  clientDefaultValues,
} from "@/schemas/client.schema";

const ClientsPage = () => {
  const toast = useRef<Toast | null>(null);
  const [createClient, { isLoading: isSubmitting }] = useCreateClientMutation();
  const [updateClient] = useUpdateClientMutation();

  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientType | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ClientSchema),
    defaultValues: clientDefaultValues,
  });

  const onSubmit = async (data: ClientType) => {
    if (editMode && currentClient) {
      if (!currentClient.id) {
        showError("Client ID is missing. Cannot update client.");
        return;
      }
      updateClient({ id: currentClient.id, data })
        .unwrap()
        .then(() => {
          showSuccess("Client updated successfully.");
          reset();
          setVisible(false);
          setEditMode(false);
          setCurrentClient(null);
        })
        .catch((error: any) => {
          if (error.data) {
            Object.keys(error.data).forEach((field) => {
              setError(field as keyof ClientType, {
                type: "manual",
                message: error.data[field][0],
              });
            });
          } else {
            showError("Failed to update client. Please try again.");
          }
        });
    } else {
      createClient(data)
        .unwrap()
        .then(() => {
          showSuccess("Client added successfully.");
          reset();
          setVisible(false);
        })
        .catch((error: any) => {
          if (error.data) {
            Object.keys(error.data).forEach((field) => {
              setError(field as keyof ClientType, {
                type: "manual",
                message: error.data[field][0],
              });
            });
          } else {
            showError("Failed to create client. Please try again.");
          }
        });
    }
  };

  const showError = (errorMessage: string) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Operation Failed",
        detail: errorMessage || "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  };

  const showSuccess = (successMessage: string) => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Operation Successful",
        detail: successMessage,
        life: 3000,
      });
    }
  };

  const onCreateClient = () => {
    reset(clientDefaultValues);
    setVisible(true);
    setEditMode(false);
    setCurrentClient(null);
  };

  const onEditClient = (client: ClientType) => {
    setCurrentClient(client);
    reset(client);
    setVisible(true);
    setEditMode(true);
  };

  const onHideModal = () => {
    reset();
    setVisible(false);
    setEditMode(false);
    setCurrentClient(null);
  };

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <ClientList onCreate={onCreateClient} onEdit={onEditClient} />
      </div>
      <ClientModal
        visible={visible}
        onHide={onHideModal}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ClientsPage;
