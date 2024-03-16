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
              <div className="text-900 font-medium text-xl">2321</div>
            </div>
            <PermissionCheck allowedPermissions={["view_user"]}>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-shopping-cart text-blue-500 text-xl" />
              </div>
            </PermissionCheck>
          </div>
          <span className="text-green-500 font-medium">24 new </span>
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
                <div className="text-900 font-medium text-xl">$235,623.00</div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-orange-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-briefcase text-orange-500 text-xl" />
              </div>
            </div>
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span>
          </div>
        </div>
      </PermissionCheck>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Payments</span>
              <div className="text-900 font-medium text-xl">$132,540.00</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-money-bill text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">520 </span>
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
              <div className="text-900 font-medium text-xl">3760 Processed</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-comment text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-red-500 font-medium">86 </span>
          <span className="text-500">rejected</span>
        </div>
      </div>

      <div className="col-12 xl:col-8">
        <div className="card">
          <h5>Recent Loans</h5>
          <DataTable
            value={products}
            rows={5}
            paginator
            responsiveLayout="scroll"
          >
            <Column
              header="Image"
              body={(data) => (
                <img
                  className="shadow-2"
                  src={`/demo/images/product/${data.image}`}
                  alt={data.image}
                  width="50"
                />
              )}
            />
            <Column
              field="name"
              header="Name"
              sortable
              style={{ width: "35%" }}
            />
            <Column
              field="price"
              header="Price"
              sortable
              style={{ width: "35%" }}
              body={(data) => formatCurrency(data.price)}
            />
            <Column
              header="View"
              style={{ width: "15%" }}
              body={() => (
                <>
                  <Button icon="pi pi-search" text />
                </>
              )}
            />
          </DataTable>
        </div>
        <div className="card">
          <div className="flex justify-content-between align-items-center mb-5">
            <h5>Best Selling Products</h5>
            <div>
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                rounded
                text
                className="p-button-plain"
                onClick={(event) => menu1.current?.toggle(event)}
              />
              <Menu
                ref={menu1}
                popup
                model={[
                  { label: "Add New", icon: "pi pi-fw pi-plus" },
                  { label: "Remove", icon: "pi pi-fw pi-minus" },
                ]}
              />
            </div>
          </div>
          <ul className="list-none p-0 m-0">
            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
              <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                  Space T-Shirt
                </span>
                <div className="mt-1 text-600">Clothing</div>
              </div>
              <div className="mt-2 md:mt-0 flex align-items-center">
                <div
                  className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                  style={{ height: "8px" }}
                >
                  <div
                    className="bg-orange-500 h-full"
                    style={{ width: "50%" }}
                  />
                </div>
                <span className="text-orange-500 ml-3 font-medium">%50</span>
              </div>
            </li>
            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
              <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                  Portal Sticker
                </span>
                <div className="mt-1 text-600">Accessories</div>
              </div>
              <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                <div
                  className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                  style={{ height: "8px" }}
                >
                  <div
                    className="bg-cyan-500 h-full"
                    style={{ width: "16%" }}
                  />
                </div>
                <span className="text-cyan-500 ml-3 font-medium">%16</span>
              </div>
            </li>
            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
              <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                  Supernova Sticker
                </span>
                <div className="mt-1 text-600">Accessories</div>
              </div>
              <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                <div
                  className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                  style={{ height: "8px" }}
                >
                  <div
                    className="bg-pink-500 h-full"
                    style={{ width: "67%" }}
                  />
                </div>
                <span className="text-pink-500 ml-3 font-medium">%67</span>
              </div>
            </li>
            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
              <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                  Wonders Notebook
                </span>
                <div className="mt-1 text-600">Office</div>
              </div>
              <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                <div
                  className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                  style={{ height: "8px" }}
                >
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: "35%" }}
                  />
                </div>
                <span className="text-green-500 ml-3 font-medium">%35</span>
              </div>
            </li>
            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
              <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                  Mat Black Case
                </span>
                <div className="mt-1 text-600">Accessories</div>
              </div>
              <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                <div
                  className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                  style={{ height: "8px" }}
                >
                  <div
                    className="bg-purple-500 h-full"
                    style={{ width: "75%" }}
                  />
                </div>
                <span className="text-purple-500 ml-3 font-medium">%75</span>
              </div>
            </li>
            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
              <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                  Robots T-Shirt
                </span>
                <div className="mt-1 text-600">Clothing</div>
              </div>
              <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                <div
                  className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                  style={{ height: "8px" }}
                >
                  <div
                    className="bg-teal-500 h-full"
                    style={{ width: "40%" }}
                  />
                </div>
                <span className="text-teal-500 ml-3 font-medium">%40</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="col-12 xl:col-4">
        <div className="h-full flex flex-col">
          <div className="card p-5 mt-6 bg-primary">
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
                  479,578.77{" "}
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
