import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { TransactionType } from "@/types/common";
import { formatCurrency, formatDateTime } from "@/utils/helpers";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { CurrencyType } from "@/schemas/currency.schema";
import { useGetBranchesQuery } from "@/redux/features/branchApiSlice";
import { useGetGlobalSettingsQuery } from "@/redux/features/globalSettingsApiSlice";
import Logo from "../Logo";

interface PaymentReceiptProps {
  visible: boolean;
  onHide: () => void;
  paymentData: TransactionType;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  visible,
  onHide,
  paymentData,
}) => {
  const {
    data: currencies,
    isError: isCurrenciesError,
    isLoading: isCurrenciesLoading,
  } = useGetCurrenciesQuery();

  const {
    data: branches,
    isError: isBranchError,
    isLoading: isBranchLoading,
  } = useGetBranchesQuery();

  const {
    data: globalSettings,
    isError: isGlobalError,
    isLoading: isGlobalLoading,
  } = useGetGlobalSettingsQuery();

  const mediaUrl = globalSettings?.[0]?.company_logo;
  const branch =
    branches?.find((branch) => branch.name === paymentData.branch) || null;
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  const currencyFormat = (amount: number, code: any) => {
    const currency =
      currencies?.find(
        (curr: CurrencyType) => curr.id === code || curr.code === code
      ) || null;
    return amount ? formatCurrency(amount, currency) : null;
  };

  return (
    <Dialog
      header="Payment Receipt"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={onHide}
      footer={
        <div>
          <button
            type="button"
            onClick={handlePrint}
            className="p-button p-component p-button-secondary"
          >
            <span className="p-button-icon p-c pi pi-print"></span>
            <span className="p-button-text p-c">Print</span>
          </button>
        </div>
      }
    >
      <div ref={printRef} className="shadow-md p-2 mx-auto w-[80mm] bg-white">
        <div id="top" className="border-b border-gray-200 min-h-[100px]">
          <div className="info text-center">
            <div className="flex justify-center items-center">
              <Logo size="xl" disableText />
            </div>
            <p className="text-sm font-medium">
              <strong>Client:</strong> {paymentData.client_name}
            </p>
          </div>
        </div>

        <div id="mid" className="border-b border-gray-200 min-h-[80px]">
          <div className="info">
            <h2 className="text-xs font-medium">Branch Info</h2>
            <p className="text-xs text-gray-600 leading-snug">
              Address: {branch?.address}
              <br />
              Email: {branch?.email}
              <br />
              Phone: {branch?.phone}
            </p>
          </div>
        </div>

        <div id="bot" className="min-h-[50px] mt-4">
          <div id="table">
            <table className="w-full border-collapse">
              <thead>
                <tr className="tabletitle bg-gray-200 text-xs">
                  <th className="Rate p-1 text-left">Date</th>
                  <th className="item p-1 text-left">Description</th>
                  <th className="Hours p-1 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="service border-b border-gray-200">
                  <td className="tableitem p-1 text-xs">
                    {formatDateTime(paymentData.created_at)}
                  </td>
                  <td className="tableitem p-1 text-xs">
                    {paymentData.description}
                  </td>
                  <td className="tableitem p-1 text-xs">
                    {currencyFormat(
                      parseFloat((paymentData.credit || 0).toString()),
                      paymentData.currency
                    )}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="tabletitle bg-gray-200 text-xs">
                  <td></td>
                  <td className="Rate p-1 font-semibold">Total</td>
                  <td className="payment p-1 font-semibold">
                    {currencyFormat(
                      parseFloat((paymentData.credit || 0).toString()),
                      paymentData.currency
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div id="legalcopy" className="mt-4">
            <p className="legal text-xs text-gray-600">
              <strong>Processed by:</strong> {paymentData.created_by}
              <br />
              <br />
              <strong>Thank you for your payment!</strong> Please keep this
              receipt for your records.
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentReceipt;
