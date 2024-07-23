"use client";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useGetClientQuery } from "@/redux/features/clientApiSlice";
import Image from "next/image"; // for handling profile photo if available
import { formatDate } from "@/utils/helpers";
import AmountTemplate from "@/components/AmountTemplate";

const ClientPage = () => {
  const params = useParams<{ id: string }>();
  const { data: client } = useGetClientQuery(Number(params.id));
  const toast = useRef<Toast | null>(null);
  const [activeTab, setActiveTab] = useState("contacts");

  if (!client) {
    return <div>Loading...</div>;
  }

  const renderContacts = () => {
    const primaryPhone = client.contacts.find((c) => c.is_primary);
    const otherPhones = client.contacts.filter((c) => !c.is_primary);

    const renderPhone = (contact: any) => (
      <div className="flex justify-between items-center mb-2">
        <span>{contact.phone}</span>
        <div className="flex space-x-2">
          {contact.is_primary && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              Primary
            </span>
          )}
          {contact.is_active && (
            <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              Active
            </span>
          )}
          {contact.is_whatsapp && (
            <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              WhatsApp
            </span>
          )}
        </div>
      </div>
    );

    return (
      <div className="m-4">
        <h3 className="text-xl font-bold mb-4">Contacts</h3>
        <div className="bg-white p-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Email</h4>
            <div className="bg-gray-100 p-2 rounded-lg">
              {client.emails.map((email, index) => (
                <p key={index} className="mb-1">
                  {email}
                </p>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Phone Numbers</h4>
            <div className="bg-gray-100 p-2 rounded-lg">
              {primaryPhone && renderPhone(primaryPhone)}
              {otherPhones.map((contact, index) => (
                <div key={index}>{renderPhone(contact)}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Branch:</span>
              <span>{client.branch_name || "Branch not available"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Country:</span>
              <span>{client.country || "Country not available"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderNextOfKin = () => {
    return (
      <div className="m-4">
        <h3 className="text-xl font-bold mb-4">Next of Kin</h3>
        <div className="bg-white p-4 ">
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Details</h4>
            <div className="bg-gray-100 p-2 rounded-lg">
              <p className="mb-2 ">
                <span className="font-semibold">Full Name:</span>{" "}
                {client.next_of_kin.first_name} {client.next_of_kin.last_name}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Relationship:</span>{" "}
                {client.next_of_kin.relationship}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Phone:</span>{" "}
                {client.next_of_kin.phone}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Email:</span>{" "}
                {client.next_of_kin.email}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Address</h4>
            <div className="bg-gray-100 p-2 rounded-lg">
              <p>{client.next_of_kin.address}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderEmployer = () => {
    return (
      <div className="m-4">
        <h3 className="text-xl font-bold mb-4">Employer Details</h3>
        <div className="bg-white p-4 ">
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Contact Information</h4>
            <div className="bg-gray-100 p-2 rounded-lg">
              <p className="mb-2">
                <span className="font-semibold">Contact Person:</span>{" "}
                {client.employer.contact_person}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Phone:</span>{" "}
                {client.employer.phone}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Email:</span>{" "}
                {client.employer.email}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Company Details</h4>
            <div className="bg-gray-100 p-2 rounded-lg">
              <p className="mb-2">
                <span className="font-semibold">Name:</span>{" "}
                {client.employer.name}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Address:</span>{" "}
                {client.employer.address}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Job Title:</span>{" "}
                {client.employer.job_title}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderClientLimits = () => {
    return (
      <div className="m-4">
        <h3 className="text-xl font-bold mb-4">Client Limits</h3>
        <div className="bg-white p-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Limit Information</h4>
            <div className="bg-gray-100 p-2 rounded-lg">
              <p className="mb-2">
                <span className="font-semibold">Max Loan:</span>{" "}
                {
                  <AmountTemplate
                    amount={client.client_limit.max_loan!}
                    currencyId={client.client_limit.currency}
                  />
                }
              </p>
              <p className="mb-2">
                <span className="font-semibold">Credit Score:</span>{" "}
                {client.client_limit.credit_score}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Currency:</span>{" "}
                {client.client_limit.currency_name}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "contacts":
        return renderContacts();
      case "next_of_kin":
        return renderNextOfKin();
      case "employer":
        return renderEmployer();
      case "client_limit":
        return renderClientLimits();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Client Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-3 p-4 rounded-lg shadow bg-white">
            <div className="flex flex-col items-center">
              {client.photo ? (
                <Image
                  src={client.photo}
                  alt={client.full_name!}
                  width={100}
                  height={100}
                  className="rounded-full border border-gray-300"
                />
              ) : (
                <div className="bg-gray-300 rounded-full w-24 h-24 flex items-center justify-center border border-gray-300">
                  <span className="text-4xl text-gray-700">
                    {client.full_name!.charAt(0)}
                  </span>
                </div>
              )}
              <h2 className="mt-2 font-bold text-lg text-center">
                {client.full_name}
              </h2>
              <p className=" text-gray-500 text-center">
                {client.employer?.job_title || "N/A"}
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-start space-x-2">
                  <i className="pi pi-at text-gray-500 mr-3"></i>
                  <p className="">{client.emails[0]}</p>
                </div>
                <div className="flex items-center justify-start space-x-2">
                  <i className="pi pi-phone text-gray-500 mr-3"></i>
                  <p className="">
                    {client.contacts.find((c) => c.is_primary)?.phone || "N/A"}
                  </p>
                </div>
                <div className="flex items-center justify-start space-x-2">
                  <i className="pi pi-id-card text-gray-500 mr-3"></i>
                  <p className="">
                    {client.national_id || client.passport_number || "N/A"}
                  </p>
                </div>
                <div className="flex items-center justify-start space-x-">
                  <i className="pi pi-calendar text-gray-500 mr-3"></i>
                  <p className="">
                    {client.date_of_birth
                      ? `${formatDate(client.date_of_birth)} (Age: ${
                          client.age
                        })`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-8 bg-white p-4 rounded-lg shadow">
            <div className="tabs">
              <ul className="flex border-b">
                <li className="mr-2">
                  <button
                    className={`inline-block py-2 px-4 font-semibold ${
                      activeTab === "contacts"
                        ? "text-blue-500"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                    onClick={() => setActiveTab("contacts")}
                  >
                    Contacts
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    className={`inline-block py-2 px-4 font-semibold ${
                      activeTab === "next_of_kin"
                        ? "text-blue-500"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                    onClick={() => setActiveTab("next_of_kin")}
                  >
                    Next of Kin
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    className={`inline-block py-2 px-4 font-semibold ${
                      activeTab === "employer"
                        ? "text-blue-500"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                    onClick={() => setActiveTab("employer")}
                  >
                    Employer
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    className={`inline-block py-2 px-4 font-semibold ${
                      activeTab === "client_limit"
                        ? "text-blue-500"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                    onClick={() => setActiveTab("client_limit")}
                  >
                    Client Limits
                  </button>
                </li>
              </ul>
            </div>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
