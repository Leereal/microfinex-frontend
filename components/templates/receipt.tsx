import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { LoanType } from "@/types/common";
import { formatCurrency, formatDateTime } from "@/utils/helpers";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { CurrencyType } from "@/schemas/currency.schema";
import { useGetBranchesQuery } from "@/redux/features/branchApiSlice";
import Image from "next/image";
import { classNames } from "primereact/utils";
import { useGetGlobalSettingsQuery } from "@/redux/features/globalSettingsApiSlice";

interface ReceiptModalProps {
  visible: boolean;
  onHide: () => void;
  receiptData: LoanType;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  visible,
  onHide,
  receiptData,
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

  const mediaUrl = globalSettings && globalSettings[0]?.company_logo;

  const branch =
    branches?.find((branch) => branch.id === receiptData.branch) || null;

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

  // Calculate total amount
  const totalAmount = receiptData.transactions.reduce(
    (acc, transaction) => acc + parseFloat((transaction.debit || 0).toString()),
    0
  );

  const currencyFormat = (amount: number, code: any) => {
    const currency =
      currencies?.find(
        (curr: CurrencyType) => curr.id === code || curr.code === code
      ) || null;
    return amount ? formatCurrency(amount, currency) : null;
  };

  return (
    <Dialog
      header="Disbursement Receipt"
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
      <div
        ref={printRef}
        id="invoice-POS"
        className="shadow-md p-2 mx-auto w-[80mm] bg-white"
      >
        <div id="top" className="border-b border-gray-200 min-h-[100px]">
          <div
            className="logo h-[60px] w-[60px] bg-no-repeat bg-contain mx-auto"
            style={{
              backgroundImage: `url('${mediaUrl}')`,
            }}
          ></div>
          <div className="info text-center">
            <h2 className="text-lg font-bold">Microfinex Pro</h2>
            <p className="text-sm font-medium">
              <strong>Client:</strong> {receiptData.client_full_name}
            </p>
          </div>
        </div>

        <div id="mid" className="border-b border-gray-200 min-h-[80px]">
          <div className="info">
            <h2 className="text-xs font-medium">Contact Info</h2>
            <p className="text-xs text-gray-600 leading-snug">
              Address : {branch?.address}
              <br />
              Email : {branch?.email}
              <br />
              Phone : {branch?.phone}
              <br />
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
                  <th className="Hours p-1 text-left">Debit</th>
                </tr>
              </thead>
              <tbody>
                {receiptData.transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="service border-b border-gray-200"
                  >
                    <td className="tableitem p-1 text-xs">
                      {formatDateTime(receiptData.disbursement_date)}
                    </td>
                    <td className="tableitem p-1 text-xs">
                      {transaction.description}
                    </td>
                    <td className="tableitem p-1 text-xs">
                      {currencyFormat(
                        parseFloat((transaction.debit || 0).toString()),
                        transaction.currency
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="tabletitle bg-gray-200 text-xs">
                  <td></td>
                  <td className="Rate p-1 font-semibold">Total</td>
                  <td className="payment p-1 font-semibold">
                    {currencyFormat(totalAmount, receiptData.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div id="legalcopy" className="mt-4">
            <p className="legal text-xs text-gray-600">
              <strong>Processed by:</strong> {receiptData.loan_created_by}
              <br />
              <br />
              <strong>Thank you for your trust!</strong> Your loan disbursement
              has been successfully processed. Please keep this receipt for your
              records.
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ReceiptModal;
