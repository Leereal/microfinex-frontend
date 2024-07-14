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
import SummaryReport from "./_components/SummaryReport";
import { Skeleton } from "primereact/skeleton";

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

interface CardItemProps {
  title: string;
  amount: string | number;
  subtitle: string;
  subtitleValue: string | number;
  iconClass: string;
  iconBgClass: string;
  allowedPermissions?: string[];
  notAllowedPermissions?: string[];
}

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

  const CardItem: React.FC<CardItemProps> = ({
    title,
    amount,
    subtitle,
    subtitleValue,
    iconClass,
    iconBgClass,
    allowedPermissions,
    notAllowedPermissions,
  }) => {
    const permissionProps = allowedPermissions
      ? { allowedPermissions }
      : notAllowedPermissions
      ? { notAllowedPermissions }
      : {};

    return (
      <PermissionCheck {...permissionProps}>
        <div className="col-12 lg:col-6 xl:col-3">
          <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">{title}</span>
                <div className="text-900 font-medium text-xl">{amount}</div>
              </div>
              <div
                className={`flex align-items-center justify-content-center ${iconBgClass} border-round`}
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className={`${iconClass} text-xl`} />
              </div>
            </div>
            <span className="text-green-500 font-medium">{subtitleValue} </span>
            <span className="text-500">{subtitle}</span>
          </div>
        </div>
      </PermissionCheck>
    );
  };
  const DashboardSkeleton = () => (
    <div className="grid">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <Skeleton height="100px" />
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <Skeleton height="100px" />
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <Skeleton height="100px" />
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <Skeleton height="100px" />
        </div>
      </div>

      <div className="col-12 xl:col-8">
        <div className="card">
          <Skeleton height="400px" />
        </div>
      </div>
      <div className="col-12 xl:col-4">
        <div className="card">
          <Skeleton height="400px" />
        </div>
      </div>
    </div>
  );

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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <div>Error loading dashboard data</div>;
  }

  if (!dashboard) {
    return <div>No dashboard data available</div>;
  }

  return (
    <div className="grid">
      <CardItem
        title="Clients"
        amount={dashboard?.total_clients}
        subtitle="since last visit"
        subtitleValue={`${dashboard?.new_clients_this_week} new`}
        iconClass="pi pi-users text-blue-500"
        iconBgClass="bg-blue-100"
        // allowedPermissions={["view_user"]}
      />
      <CardItem
        title="Disbursements"
        amount={`$${dashboard?.total_disbursements_amount}`}
        subtitle="since last week"
        subtitleValue={`${dashboard?.percentage_increase_disbursements}%+`}
        iconClass="pi pi-briefcase text-orange-500"
        iconBgClass="bg-orange-100"
        // notAllowedPermissions={["view_user"]}
      />
      <CardItem
        title="Payments"
        amount={`$${dashboard?.total_payments_amount}`}
        subtitle="transactions this week"
        subtitleValue={dashboard?.total_payments}
        iconClass="pi pi-money-bill text-cyan-500"
        iconBgClass="bg-cyan-100"
      />
      <CardItem
        title="Total Loans"
        amount={`${dashboard?.total_loans_processed} Processed`}
        subtitle="rejected"
        subtitleValue={dashboard?.rejected_loans_count}
        iconClass="pi pi-book text-purple-500"
        iconBgClass="bg-purple-100"
      />

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
      <SummaryReport dashboard={dashboard} />
    </div>
  );
};

export default Dashboard;
