import React, { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { Controller } from "react-hook-form";

type FormAutocompleteProps = {
  label: string;
  id: string;
  control: any; // Using 'control' from react-hook-form
  error?: {
    message: string;
  };
  clients: ClientType[];
};

const FormAutocomplete: React.FC<FormAutocompleteProps> = ({
  label,
  id,
  control, // Destructure control from props
  error,
  clients,
}) => {
  const [filteredClients, setFilteredClients] = useState<ClientType[]>([]);
  console.log("Clients in Modal: ", clients);

  const search = (event: { query: string }) => {
    let _filteredClients;

    if (!event.query.trim().length) {
      _filteredClients = [...clients];
    } else {
      _filteredClients = clients.filter((client) => {
        return (
          client.full_name
            .toLowerCase()
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
      <div className="flex align-items-center">
        <div>{client.full_name}</div>
        <div>
          {client.national_id ? client.national_id : client.passport_number}
        </div>
      </div>
    );
  };

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <AutoComplete
            {...field}
            id={id}
            className={classNames({ "p-invalid": !!error })}
            suggestions={filteredClients}
            completeMethod={search}
            field="full_name"
            itemTemplate={itemTemplate}
          />
        )}
      />
      {error && <small className="p-error">{error?.message}</small>}
    </div>
  );
};

export default FormAutocomplete;
