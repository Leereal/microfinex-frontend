import React, { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { Controller, useFormContext } from "react-hook-form";
import { ClientType } from "@/schemas/client.schema";

type FormAutocompleteProps = {
  label: string;
  id: string;
  control: any; // Using 'control' from react-hook-form
  error?: any;
  clients: ClientType[];
};

const FormAutocomplete: React.FC<FormAutocompleteProps> = ({
  label,
  id,
  error,
  clients,
  control,
}) => {
  const [filteredClients, setFilteredClients] = useState<ClientType[]>([]);
  const search = (event: { query: string }) => {
    let _filteredClients;

    if (!event.query.trim().length) {
      _filteredClients = [...clients];
    } else {
      _filteredClients = clients.filter((client) => {
        return (
          client
            .full_name!.toLowerCase()
            .startsWith(event.query.toLowerCase()) ||
          client.national_id
            ?.toLowerCase()
            .startsWith(event.query.toLowerCase()) ||
          client.passport_number
            ?.toLowerCase()
            .startsWith(event.query.toLowerCase()) ||
          client.contacts.some((contact) =>
            contact.phone.toLowerCase().startsWith(event.query.toLowerCase())
          )
        );
      });
    }

    setFilteredClients(_filteredClients);
  };

  useEffect(() => {
    // Reset filteredClients when clients change
    setFilteredClients(clients);
  }, [clients]);

  const itemTemplate = (client: ClientType) => {
    return (
      <div className="flex align-items-center text-sm font-bold space-x-3">
        <span>{client.full_name}</span>
        <span>|</span>
        <span>
          {client.national_id ? client.national_id : client.passport_number}
        </span>
      </div>
    );
  };

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Controller
        name={id}
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <AutoComplete
            id={id}
            value={value ? clients.find((client) => client.id === value) : null}
            onChange={(e) => onChange(e.value.id)}
            ref={ref}
            className={classNames({ "p-invalid": !!error })}
            suggestions={filteredClients}
            completeMethod={search}
            field="full_name"
            itemTemplate={itemTemplate}
          />
        )}
      />
      {error && <small className="p-error">{error.message}</small>}
    </div>
  );
};

export default FormAutocomplete;
