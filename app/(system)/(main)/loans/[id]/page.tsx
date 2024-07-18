"use client";
import { useRef } from "react";
import { useParams } from "next/navigation";
import { useGetLoanQuery } from "@/redux/features/loanApiSlice";
import { Button } from "primereact/button";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Tooltip } from "react-tooltip";
import Logo from "@/components/Logo";
import { Divider } from "primereact/divider";
import { useGetBranchesQuery } from "@/redux/features/branchApiSlice";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { CurrencyType } from "@/schemas/currency.schema";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/helpers";
import { Tag } from "primereact/tag";
import { TransactionType } from "@/types/common";

const LoanStatement = () => {
  const params = useParams<{ id: string }>();
  const { data: loan, isLoading: isLoanLoading } = useGetLoanQuery(
    Number(params.id)
  );
  const { data: currencies, isLoading: isCurrencyLoading } =
    useGetCurrenciesQuery();
  const { data: branches, isLoading: isBranchesLoading } =
    useGetBranchesQuery();

  console.log(" Loan : ", loan);

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

  const branch = branches?.find((branch) => branch.id === loan?.branch) || null;

  const currencyFormat = (amount: number, code: any) => {
    const currency =
      currencies?.find(
        (curr: CurrencyType) => curr.id === code || curr.code === code
      ) || null;
    return amount ? formatCurrency(amount, currency) : null;
  };

  const exportPdf = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190; // Width of image in PDF
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("loan_statement.pdf");
    }
  };

  const getLoanSeverity = (status: string) => {
    switch (status) {
      case "Pending":
      case "Overdue":
      case "Default":
      case "Cancelled":
      case "Failed":
      case "Legal":
      case "Bad Debt":
        return "danger";
      case "Approved":
      case "Active":
      case "Completed":
      case "Closed":
        return "success";
      default:
        return null;
    }
  };

  const getTransactionSeverity = (transactionStatus: string) => {
    switch (transactionStatus) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "cancelled":
        return "danger";
      case "refunded":
        return "success";
      case "review":
        return "info";
      default:
        return null;
    }
  };

  const statusTemplate = (status: string) => (
    <Tag value={status} severity={getLoanSeverity(status)} />
  );

  const transactionStatusBodyTemplate = (status: string) => (
    <Tag
      value={status}
      severity={getTransactionSeverity(status)}
      className="capitalize"
    />
  );
  const totalDebit =
    loan?.transactions.reduce(
      (acc: number, transaction: any) => acc + Number(transaction.debit || 0),
      0
    ) || 0;

  const totalCredit =
    loan?.transactions.reduce(
      (acc: number, transaction: any) => acc + Number(transaction.credit || 0),
      0
    ) || 0;
  const currentBalance = totalCredit - totalDebit;

  if (!loan && (isLoanLoading || isBranchesLoading || isCurrencyLoading))
    return null;

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-primary-700">
              {loan?.client_full_name} Loan Statement
            </h3>
            <div className="flex space-x-3">
              <Tooltip anchorSelect=".print-button" content="Print" />
              <Button
                type="button"
                icon="pi pi-print"
                severity="success"
                rounded
                onClick={handlePrint}
                className="print-button"
                tooltipOptions={{ position: "left" }}
              />
              <Tooltip anchorSelect=".pdf-button" content="Export as PDF" />
              <Button
                type="button"
                icon="pi pi-file-pdf"
                severity="warning"
                rounded
                onClick={exportPdf}
                className="pdf-button"
                tooltipOptions={{ position: "top" }}
              />
            </div>
          </div>
          <div className="loan-statement p-8" ref={printRef}>
            <div className="statement-header flex justify-between items-start mb-4">
              <div className="company-details text-sm">
                <Logo />
                <Divider type="dashed" />
                <p>
                  <span className="font-semibold">Branch: </span>
                  <span>{branch?.name}</span>
                </p>
                <p>
                  <span className="font-semibold">Address: </span>
                  <span>{branch?.address}</span>
                </p>
                <p>
                  <span className="font-semibold">Phone: </span>
                  <span>{branch?.phone}</span>
                </p>
                <p>
                  <span className="font-semibold">Email: </span>
                  <span>{branch?.email}</span>
                </p>
              </div>
              <div className="loan-details text-left">
                <p className="text-lg font-semibold">
                  {loan?.client_full_name}
                </p>
                <p>Loan number: {loan?.id}</p>
                <p>Total amount due:</p>
                <p
                  className={`text-4xl font-bold ${
                    (loan?.balance ?? 0) <= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {currencyFormat(loan?.balance ?? 0, loan?.currency) || 0}
                </p>
                <p className="text-xs italic font-semibold">
                  After {formatDate(loan?.expected_repayment_date ?? "")}, a
                  late fee will be charged.
                </p>
              </div>
            </div>

            <div className="statement-body mb-8">
              <div className="current-payment mb-4">
                <div className="bg-primary">
                  <h4 className="p-1 items-center text-lg font-bold text-white">
                    Current Payment
                  </h4>
                </div>
                <div className="flex gap-8">
                  <div className="payment-overview mb-4 w-full sm:w-1/2">
                    <p className="font-semibold border-b-2 border-black">
                      Initial Loan Overview
                    </p>
                    <div className="flex justify-between">
                      <span>Principal</span>
                      <span>
                        {currencyFormat(loan?.amount ?? 0, loan?.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b-2 border-black">
                      <span>Interest</span>
                      <span>
                        {currencyFormat(
                          loan?.interest_amount ?? 0,
                          loan?.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Initial Total</span>
                      <span>
                        {currencyFormat(
                          (loan?.amount ?? 0) + (loan?.interest_amount ?? 0),
                          loan?.currency
                        )}
                      </span>{" "}
                    </div>
                  </div>
                  <div className="account-info w-full sm:w-1/2 space-y-1">
                    <p className="font-semibold border-b-2 border-black">
                      Account Information
                    </p>
                    <div className="flex justify-between">
                      <span>Statement date</span>
                      <span>{formatDate(new Date())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan status</span>
                      <span>{statusTemplate(loan?.status ?? "")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Product</span>
                      <span className="capitalize">{loan?.product_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest rate</span>
                      <span>{loan?.interest_rate ?? 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disbursement date</span>
                      <span>{formatDate(loan?.disbursement_date || "")}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="activity-section">
                <div className="bg-primary">
                  <h4 className="p-1 items-center text-lg font-bold text-white">
                    Activity since disbursement
                  </h4>
                </div>
                <div className="flex gap-8">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 text-left">Date</th>
                        <th className="py-2 px-4 text-left">Transaction</th>
                        <th className="py-2 px-4 text-left">Charge</th>
                        <th className="py-2 px-4 text-left">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loan?.transactions.map(
                        (transaction: any, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="py-2 px-4">
                              {formatDateTime(transaction.created_at)}
                            </td>
                            <td className="py-2 px-4">
                              {transaction.description}{" "}
                              {transaction.status !== "approved" &&
                                transactionStatusBodyTemplate(
                                  transaction?.status ?? ""
                                )}
                            </td>
                            <td className="py-2 px-4">
                              {transaction.debit
                                ? currencyFormat(
                                    transaction.debit,
                                    transaction?.currency
                                  )
                                : ""}
                            </td>
                            <td className="py-2 px-4">
                              {transaction.credit
                                ? currencyFormat(
                                    transaction.credit,
                                    transaction?.currency
                                  )
                                : ""}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t font-bold">
                        <td className="py-2 px-4" colSpan={2}>
                          Totals
                        </td>
                        <td className="py-2 px-4">
                          {currencyFormat(
                            totalDebit,
                            loan?.transactions[0]?.currency
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {currencyFormat(
                            totalCredit,
                            loan?.transactions[0]?.currency
                          )}
                        </td>
                      </tr>
                      <tr
                        className={`font-extrabold ${
                          (loan?.balance ?? 0) <= 0
                            ? "text-green-500"
                            : " text-red-500"
                        }`}
                      >
                        <td className="py-2 px-4" colSpan={2}>
                          Current Balance (Due{" "}
                          {formatDate(loan?.expected_repayment_date ?? "")})
                        </td>
                        <td className="py-2 px-4" colSpan={2}>
                          {currencyFormat(
                            -(loan?.balance ?? 0),
                            loan?.transactions[0]?.currency
                          ) || 0}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="additional-info mt-8">
                <p className="font-semibold border-b-2 border-black">
                  Additional Information
                </p>
                <p>
                  Consider setting up a debit order to ensure you never miss a
                  due date and avoid any penalties. This convenient option will
                  automatically deduct your payments from your account, giving
                  you peace of mind and keeping your account in good standing.
                </p>
                <br />
                <p>
                  <span className="font-semibold">Questions? </span> Visit our
                  offices or call {branch?.phone} or email {branch?.email}
                </p>
                <br />
                <p>
                  Thank you for doing business with us. We appreciate your trust
                  and look forward to serving you again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStatement;
