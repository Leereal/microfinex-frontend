import React, { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "primereact/button";
import FormDropdown from "@/components/FormDropdown";
import FormPhoneInput from "@/components/FormPhoneInput";
import FormRadioButton from "@/components/FormRadioButton";
import FormCheckbox from "@/components/FormCheckbox";
import FormInput from "@/components/FormInput";
import { classNames } from "primereact/utils";

const contactTypeOptions = [
  { label: "Cellphone", value: "Cellphone" },
  { label: "Home", value: "Home" },
  { label: "Work", value: "Work" },
  { label: "Other", value: "Other" },
];

const ContactForm = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  console.log("fields", fields);

  const addContact = () => {
    append({
      phone: "",
      type: "Cellphone",
      is_active: true,
      whatsapp: false,
      is_primary: false,
    });
  };

  const removeContact = (index: number) => {
    remove(index);
  };

  const togglePrimary = (selectedIndex: number) => {
    fields.forEach((contact, index) => {
      const isActive = watch(`contacts.${index}.is_active`);
  
      if (index === selectedIndex) {
        setValue(`contacts.${index}.is_primary`, true);
        if (!isActive) {
          setValue(`contacts.${index}.is_active`, true);
        }
      } else {
        setValue(`contacts.${index}.is_primary`, false);
      }
    });
  
    // Force re-render by updating the fields
    //TODO : Fix the issue where is active is updating the third contact on clicking the second. Bug
    //When trying to set is active false on primary contact restrict it. 
    const updatedContacts = fields.map((contact, index) => ({
      ...contact,
      is_primary: index === selectedIndex,
      is_active: index === selectedIndex ? true : (contact as { is_active?: boolean }).is_active ?? false,
    }));
  
    setValue("contacts", updatedContacts);
  };
  

  return (
    <section>
      <div className="my-2 space-y-1">
        <h2 className="text-primary text-xl font-semibold">
          Contact Information
        </h2>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-full sm:w-1/2">
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <div className="space-x-1 flex">
                <FormPhoneInput
                  label="Phone"
                  id={`contacts[${index}].phone`}
                  placeholder="Contact Number"
                  error={errors.contacts && errors?.contacts[index]?.phone}
                  register={register}
                  className="p-inputtext-sm p-inputtext p-component"
                />
                <FormDropdown
                  label="Contact Type"
                  id={`contacts[${index}].type`}
                  options={contactTypeOptions}
                  placeholder="Type"
                  error={errors.contacts && errors.contacts[index]?.type}
                  register={register}
                  className="p-inputtext-sm"
                />
              </div>
              <div
                className={classNames(
                  "flex flex-col sm:flex-row items-center justify-between space-x-1",
                  (index !== fields.length - 1) ? "border-b-2 pb-2 mb-2" : ''
                )}
              >
                <FormRadioButton
                  id={`contacts[${index}].is_primary`}
                  options={[
                    {
                      label: "Primary",
                      value: true,
                    },
                  ]}
                  register={register}
                  error={errors.contacts && errors?.contacts[index]?.is_primary}
                  className="p-inputtext-sm"
                  onChange={() => togglePrimary(index)}
                />
                <FormCheckbox
                  label="Active"
                  id={`contacts[${index}].is_active`}
                  error={errors.contacts && errors.contacts[index]?.is_active}
                  register={register}
                  className="p-inputtext-sm"
                />
                <FormCheckbox
                  label="Whatsapp"
                  id={`contacts[${index}].whatsapp`}
                  error={errors.contacts && errors.contacts[index]?.whatsapp}
                  register={register}
                  className="p-inputtext-sm"
                />
                {!watch(`contacts[${index}].is_primary`) && (
                  <span
                    className="p-button-text pi pi-minus-circle mb-2 text-red-500 cursor-pointer"
                    onClick={() => removeContact(index)}
                  />
                )}
                {index === fields.length - 1 && (
                  <span
                    className="p-button-text pi pi-plus-circle mb-2 text-green-500 cursor-pointer"
                    onClick={addContact}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="w-full sm:w-1/2">
          <FormInput
            label="Email"
            id="emails"
            type="email"
            placeholder="Email"
            register={register}
            error={errors.emails}
            className="p-inputtext-sm"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
