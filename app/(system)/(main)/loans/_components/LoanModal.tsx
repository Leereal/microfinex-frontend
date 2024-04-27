// BranchModal.js
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import FormInput from "@/components/FormInput";
import FormCalendar from "@/components/FormCalendar";
import FormInputNumber from "@/components/FormInputNumber";
import FormAutocomplete from "@/components/FormAutoComplete";
import FormDropdown from "@/components/FormDropdown";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";

type LoanModalProps = {
  visible: boolean;
  onHide: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  register: any;
  errors: any;
  isSubmitting: boolean;
  clients: ClientType[];
  currencies: CurrencyType[];
  control: any;
};

const LoanModal = ({
  visible,
  onHide,
  onSubmit,
  register,
  errors,
  isSubmitting,
  clients,
  currencies,
  control,
}: LoanModalProps) => {
  const [filteredClients, setFilteredClients] = useState<ClientType[]>([]);
  const search = (event: { query: string }) => {
    console.log("Event : ", event);

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
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header="Disburse Loan"
      modal
      className="p-fluid"
      onHide={onHide}
    >
      <form onSubmit={onSubmit}>
        <FormAutocomplete
          label="Client"
          id="client"
          register={register}
          error={errors.client}
          clients={clients} // Assuming clientList is your list of clients
          control={control}
        />
        <FormInputNumber
          label="Amount"
          id="amount"
          register={register}
          error={errors.amount}
          showButtons
        />
        <FormInput
          label="Email"
          id="email"
          type="text"
          placeholder="Email"
          register={register}
          error={errors.email}
        />
        <FormDropdown
          label="Currency"
          id="currency"
          //TODO currencies must come from the branch settings default or global settings. If not the default must be from settings then allow users to choose from list as well.
          options={currencies.map((currency) => ({
            label: currency.code,
            value: currency.id,
          }))}
          placeholder="Select a Currency"
          register={register}
          error={errors.currency}
          showClear
        />
        <FormCalendar
          label="Expected Repayment Date"
          id="expected_repayment_date"
          error={errors.date}
          register={register}
          showIcon={true}
        />
        <FormDropdown
          label="Branch Product"
          id="branch_product"
          options={[
            { label: "Product 1", value: 1 },
            { label: "Product 2", value: 2 },
          ]}
          placeholder="Select a Product"
          register={register}
          error={errors.branch_product}
        />
        <div className="p-dialog-footer pb-0">
          <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
          <Button
            type="submit"
            label="Disburse Loan"
            icon="pi pi-check"
            text
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Dialog>
  );
};

export default LoanModal;
