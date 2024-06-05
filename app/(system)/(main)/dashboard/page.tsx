"use client";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Demo } from "@/types";
import { ChartData, ChartOptions } from "chart.js";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ProductService } from "@/demo/service/ProductService";
import { PermissionCheck } from "@/components/auth/PermissionCheck";
import { useGetDashboardQuery } from "@/redux/features/dashboardApiSlice";

const lineData: ChartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: "#2f4860",
      borderColor: "#2f4860",
      tension: 0.4,
    },
    {
      label: "Second Dataset",
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: "#00bb7e",
      borderColor: "#00bb7e",
      tension: 0.4,
    },
  ],
};

const Dashboard = () => {
  const [products, setProducts] = useState<Demo.Product[]>([]);
  const menu1 = useRef<Menu>(null);
  const menu2 = useRef<Menu>(null);
  const [lineOptions, setLineOptions] = useState<ChartOptions>({});
  const { layoutConfig } = useContext(LayoutContext);
  const { data: dashboard, isError, isLoading } = useGetDashboardQuery();

  const applyLightTheme = () => {
    const lineOptions: ChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  const applyDarkTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#ebedef",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
        y: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  useEffect(() => {
    ProductService.getProductsSmall().then((data) => setProducts(data));
  }, []);

  console.log("Dashboard data", dashboard);

  useEffect(() => {
    if (layoutConfig.colorScheme === "light") {
      applyLightTheme();
    } else {
      applyDarkTheme();
    }
  }, [layoutConfig.colorScheme]);

  const formatCurrency = (value: number) => {
    return value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="grid">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Clients</span>
              <div className="text-900 font-medium text-xl">
                {dashboard?.total_clients}
              </div>
            </div>
            <PermissionCheck allowedPermissions={["view_user"]}>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-users text-blue-500 text-xl" />
              </div>
            </PermissionCheck>
          </div>
          <span className="text-green-500 font-medium">
            {dashboard?.new_clients_this_week} new{" "}
          </span>
          <span className="text-500">since last visit</span>
        </div>
      </div>
      <PermissionCheck notAllowedPermissions={["view_user"]}>
        <div className="col-12 lg:col-6 xl:col-3">
          <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">
                  Disbursements
                </span>
                <div className="text-900 font-medium text-xl">
                  ${dashboard?.total_disbursements_amount}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-orange-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-briefcase text-orange-500 text-xl" />
              </div>
            </div>
            <span className="text-green-500 font-medium">
              %{dashboard?.percentage_increase_disbursements}+{" "}
            </span>
            <span className="text-500">since last week</span>
          </div>
        </div>
      </PermissionCheck>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Payments</span>
              <div className="text-900 font-medium text-xl">
                ${dashboard?.total_payments_amount}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-money-bill text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">
            {dashboard?.total_payments}{" "}
          </span>
          <span className="text-500">transactions this week</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Total Loans
              </span>
              <div className="text-900 font-medium text-xl">
                {dashboard?.total_loans_processed} Processed
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-book text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-red-500 font-medium">
            {dashboard?.rejected_loans_count}{" "}
          </span>
          <span className="text-500">rejected</span>
        </div>
      </div>

      <div className="col-12 xl:col-8">
        <div className="card">
          <h5>Recent Loans</h5>
          <DataTable value={dashboard?.recent_loans} rows={5} paginator>
            <Column
              field="disbursement_date"
              header="Date Disbursed"
              sortable
            />
            <Column field="client_full_name" header="Client Name" sortable />
            <Column
              field="amount"
              header="Amount Disbursed"
              sortable
              body={(data) => formatCurrency(data.amount)}
            />
            <Column field="loan_created_by" header="Disbursed By" sortable />
            <Column
              header="View"
              body={() => (
                <>
                  <Button icon="pi pi-eye" text />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>

      <div className="col-12 xl:col-4">
        <div className="h-full flex flex-col">
          <div
            className={`card p-5 mt-6 ${
              dashboard && dashboard?.available_funds >= 0
                ? " bg-green-500"
                : " bg-red-500"
            }`}
          >
            <div className="flex flex-wrap gap-3">
              <div className="mr-auto">
                <div className="text-white text-opacity-70 dark:text-slate-300 flex items-center leading-3 gap-2">
                  AVAILABLE FUNDS
                  <span>
                    <i className="pi pi-info-circle"></i>
                  </span>
                </div>
                <div className="text-white relative text-2xl font-medium leading-5 pl-4 mt-3.5">
                  {" "}
                  <span className="absolute text-xl top-0 left-0 -mt-1.5">
                    $
                  </span>{" "}
                  {dashboard?.available_funds}
                </div>
              </div>
              <div className="w-[15px] h-[15px] mr-5">
                <Button className="flex items-center  justify-center rounded-full bg-white dark:bg-darkmode-300 opacity-50 hover:opacity-30 text-white px-[0.95rem] py-[0.65rem]">
                  <span className="text-primary">
                    <i className="pi pi-plus"></i>
                  </span>
                </Button>
              </div>
            </div>
          </div>
          <div className="card xl:min-h-0">
            <div className="max-h-full xl:overflow-y-auto">
              <div className="xl:sticky top-0 px-5 pb-6">
                <div className="flex items-center">
                  <div className="text-lg font-medium truncate mr-5">
                    Summary Report
                  </div>
                  <a href="" className="ml-auto flex items-center text-primary">
                    <span>
                      <i className="pi pi-refresh"></i>
                    </span>
                  </a>
                </div>
                <ul
                  className=" nav nav-pills border border-slate-300 dark:border-darkmode-300 border-dashed rounded-md mx-auto p-1 mt-5 "
                  role="tablist"
                >
                  <li
                    id="weekly-report-tab"
                    className="nav-item flex-1"
                    role="presentation"
                  >
                    <button
                      className="nav-link w-full py-1.5 px-2 active"
                      data-tw-toggle="pill"
                      data-tw-target="#weekly-report"
                      type="button"
                      role="tab"
                      aria-controls="weekly-report"
                      aria-selected="true"
                    >
                      {" "}
                      Weekly{" "}
                    </button>
                  </li>
                  <li
                    id="monthly-report-tab"
                    className="nav-item flex-1"
                    role="presentation"
                  >
                    <button
                      className="nav-link w-full py-1.5 px-2"
                      data-tw-toggle="pill"
                      data-tw-target="#monthly-report"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      {" "}
                      Monthly{" "}
                    </button>
                  </li>
                </ul>
              </div>
              <div className="tab-content px-5 pb-5">
                <div className="tab-pane active grid grid-cols-12 gap-y-6">
                  <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-12">
                    <div className="text-slate-500">Unpaid Loan</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-lg">$155.430.000</div>
                      <div className="text-danger flex text-xs font-medium tooltip cursor-pointer ml-2">
                        2%
                        <span>
                          <i className="pi pi-chevron-down"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-12">
                    <div className="text-slate-500">Active Funding Partner</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-lg">52 Partner</div>
                      <div className="text-success flex text-xs font-medium tooltip cursor-pointer ml-2">
                        {" "}
                        49%{" "}
                        <span>
                          <i className="pi pi-chevron-up"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-12">
                    <div className="text-slate-500">Paid Installment</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-lg">$75.430.000</div>
                      <div className="text-success flex text-xs font-medium tooltip cursor-pointer ml-2">
                        {" "}
                        36%{" "}
                        <span>
                          <i className="pi pi-chevron-down"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-12">
                    <div className="text-slate-500">Success Payment</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-lg">100%</div>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-12">
                    <div className="text-slate-500">
                      Waiting For Disbursement
                    </div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-lg">0</div>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-12">
                    <div className="text-slate-500">Unpaid Loan</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-lg">$21.430.000</div>
                      <div className="text-danger flex text-xs font-medium tooltip cursor-pointer ml-2">
                        {" "}
                        23%{" "}
                        <span>
                          <i className="pi pi-chevron-down"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-outline-secondary col-span-12 border-slate-300 dark:border-darkmode-300 border-dashed relative justify-start mb-2">
                    <span className="truncate mr-5">My Portfolio Details</span>
                    <span className="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5">
                      <span>
                        <i className="pi pi-chevron-down"></i>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
