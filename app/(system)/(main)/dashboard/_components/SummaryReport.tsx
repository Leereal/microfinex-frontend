import React, { useState } from "react";
import { Button } from "primereact/button";
import RefreshButton from "@/components/RefreshButton";

interface SummaryItemProps {
  title: string;
  amount: string;
  percentage?: string;
  isPositive?: boolean;
}

const SummaryReport = ({
  dashboard,
  refetch,
}: {
  dashboard: any;
  refetch: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");

  const toggleTab = (tab: "weekly" | "monthly") => {
    setActiveTab(tab);
  };

  const SummaryItem: React.FC<SummaryItemProps> = ({
    title,
    amount,
    percentage,
    isPositive,
  }) => (
    <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-12">
      <div className="text-slate-500">{title}</div>
      <div className="mt-1.5 flex items-center">
        <div className="text-lg font-medium">{amount}</div>
        {percentage !== undefined && (
          <div
            className={`flex text-xs font-medium cursor-pointer ml-2 items-center ${
              isPositive ? "text-green-400" : "text-red-500"
            }`}
          >
            {percentage}
            <span>
              <i
                className={`mx-2 pi pi-chevron-${isPositive ? "up" : "down"}`}
              ></i>
            </span>
          </div>
        )}
      </div>
    </div>
  );
  return (
    <div className="col-12 xl:col-4">
      <div className="h-full flex flex-col">
        <div
          className={`card p-5 ${
            dashboard && dashboard?.available_funds >= 0
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          <div className="flex flex-wrap gap-3">
            <div className="mr-auto">
              <div className="text-white text-opacity-70 flex items-center leading-3 gap-2">
                AVAILABLE FUNDS
                <span>
                  <i className="pi pi-info-circle"></i>
                </span>
              </div>
              <div className="text-white relative text-2xl font-medium leading-5 pl-4 mt-3.5">
                <span className="absolute text-xl top-0 left-0 -mt-1.5">$</span>{" "}
                {dashboard?.available_funds}
              </div>
            </div>
            <div className="w-[15px] h-[15px] mr-5">
              <Button className="flex items-center justify-center rounded-full bg-white opacity-50 hover:opacity-30 text-white px-[0.95rem] py-[0.65rem]">
                <span className="text-primary">
                  <i className="pi pi-plus"></i>
                </span>
              </Button>
            </div>
          </div>
        </div>
        <div className="card xl:min-h-0">
          <div className="max-h-full xl:overflow-y-auto">
            <div className="xl:sticky top-0 px-5 pb-4">
              <div className="flex items-center">
                <div className="text-lg font-medium truncate mr-5">
                  Summary Report
                </div>
                <div className="ml-auto flex">
                  <RefreshButton onRefresh={refetch} />
                </div>
              </div>
              <ul className="border border-slate-300 border-dashed rounded-md mx-auto p-2 mt-5 sm:flex space-x-2">
                <li className="nav-item flex-1">
                  <button
                    className={`nav-link w-full py-1.5 px-2 rounded-lg ${
                      activeTab === "weekly" ? "bg-green-500 text-white" : ""
                    }`}
                    onClick={() => toggleTab("weekly")}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "weekly"}
                  >
                    Weekly
                  </button>
                </li>
                <li className="nav-item flex-1">
                  <button
                    className={`nav-link w-full py-1.5 px-2 rounded-lg ${
                      activeTab === "monthly" ? "bg-green-500 text-white" : ""
                    }`}
                    onClick={() => toggleTab("monthly")}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "monthly"}
                  >
                    Monthly
                  </button>
                </li>
              </ul>
            </div>
            <div className="tab-content px-5 pb-5">
              <div
                className={`tab-pane space-y-1 ${
                  activeTab === "weekly" ? "block" : "hidden"
                } grid grid-cols-12 gap-y-6`}
              >
                <SummaryItem
                  title="Unpaid Loan"
                  amount="$155.430.000"
                  percentage="2%"
                  isPositive={false}
                />
                <SummaryItem
                  title="Active Funding Partner"
                  amount="52 Partner"
                  percentage="49%"
                  isPositive={true}
                />
                <SummaryItem
                  title="Paid Installment"
                  amount="$75.430.000"
                  percentage="36%"
                  isPositive={true}
                />
                <SummaryItem title="Success Payment" amount="100%" />
                <SummaryItem title="Waiting For Disbursement" amount="0" />
                <SummaryItem
                  title="Unpaid Loan"
                  amount="$21.430.000"
                  percentage="23%"
                  isPositive={false}
                />
                <button className="btn btn-outline-secondary col-span-12 border border-slate-300 border-dashed rounded-md flex justify-between my-2 p-2.5 w-full">
                  <span className="truncate mr-5">My Portfolio Details</span>
                  <span>
                    <i className="pi pi-arrow-right"></i>
                  </span>
                </button>
              </div>
              <div
                className={`tab-pane space-y-1 ${
                  activeTab === "monthly" ? "block" : "hidden"
                } grid grid-cols-12 gap-y-6`}
              >
                <SummaryItem
                  title="Total Payments"
                  amount="$755.430.000"
                  percentage="2%"
                  isPositive={false}
                />
                <SummaryItem
                  title="Total Payments"
                  amount="$354.430.000"
                  percentage="36%"
                  isPositive={true}
                />
                <SummaryItem
                  title="New Clients"
                  amount="153 Registrations"
                  percentage="49%"
                  isPositive={true}
                />
                <SummaryItem title="Success Debt Recovery" amount="100%" />
                <SummaryItem title="Waiting For Disbursement" amount="0" />
                <SummaryItem
                  title="Expected Payments"
                  amount="$74.430.000"
                  percentage="23%"
                  isPositive={false}
                />
                <button className="btn btn-outline-secondary col-span-12 border border-slate-300 border-dashed rounded-md flex justify-between my-2 p-2.5 w-full">
                  <span className="truncate mr-5">My Portfolio Details</span>
                  <span>
                    <i className="pi pi-arrow-right"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryReport;
