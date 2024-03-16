"use client";
import { useGetBranchesQuery } from "@/redux/features/branchApiSlice";
import { useGetBranchProductsQuery } from "@/redux/features/branchProductApiSlice";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { useGetProductsQuery } from "@/redux/features/productApiSlice";
import { currencyTemplate, statusTemplate } from "@/utils/helperTemplates";
import { Badge } from "primereact/badge";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import React, { useEffect, useRef, useState } from "react";

interface BlockItem {
  item: string;
  blocked: boolean;
}

const SettingsPage = () => {
  const { data: branches } = useGetBranchesQuery();
  const { data: currencies } = useGetCurrenciesQuery();
  const { data: products } = useGetProductsQuery();
  const { data: branch_products } = useGetBranchProductsQuery();
  const [blockedItems, setBlockedItems] = useState<BlockItem[]>([]);
  const menu1 = useRef<Menu>(null);

  const interestTemplate = (rowData: any) => {
    const interestRate = rowData["interest"];
    return <div>{interestRate.toFixed(2)}%</div>;
  };

  useEffect(() => {
    if (!branches?.length || !products?.length) {
      setBlockedItems([{ item: "branch_products", blocked: true }]);
    }
  }, []);

  return (
    <div className="col-12 flex">
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Branches</h5>
          <DataTable value={branches} rows={5} paginator>
            <Column field="name" header="Name" sortable />
            <Column field="phone" header="Phone" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="address" header="Address" sortable />
            <Column
              field="is_active"
              header="Status"
              body={() => (
                <>
                  <Badge severity="success" size="normal">
                    Active
                  </Badge>
                </>
              )}
            />
          </DataTable>
        </div>
        <div className="card">
          <div className="flex justify-content-between align-items-center mb-5">
            <h5>Monthly Targets</h5>
            <div>
              <Button
                type="button"
                icon="pi pi-fw pi-plus"
                rounded
                text
                className="p-button-plain"
                onClick={() => {}}
              />
            </div>
          </div>
          <ul className="list-none p-0 m-0">
            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
              <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                  Harare
                </span>
                <div className="mt-1 text-600">January 2024</div>
              </div>
              <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                  Target : $3000
                </span>
              </div>
              <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                  Collected: $1500
                </span>
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
          </ul>
        </div>
      </div>
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Currencies</h5>
          <DataTable value={currencies} rows={5} paginator>
            <Column field="symbol" header="Symbol" sortable />
            <Column field="name" header="Name" sortable />
            <Column field="code" header="Code" sortable />
            <Column field="is_active" header="Status" sortable />
          </DataTable>
        </div>
        <div className="card">
          <h5>Products</h5>
          <DataTable value={products} rows={5} paginator>
            <Column field="name" header="Name" sortable />
            <Column field="created_at" header="Date Created" sortable />
            <Column field="is_active" header="Status" sortable />
          </DataTable>
        </div>
        <BlockUI
          blocked={
            !!blockedItems.find(
              (component) => component.item === "branch_products"
            )
          }
          template={
            <i className="pi pi-lock" style={{ fontSize: "2rem" }}>
              Branch or Product Not Available
            </i>
          }
        >
          <div className="card">
            <h5>Branch Products</h5>
            <DataTable value={branch_products} rows={5} paginator>
              <Column field="branch.name" header="Branch" sortable />
              <Column field="product.name" header="Product" sortable />
              <Column
                field="interest"
                header="Interest (%)"
                sortable
                body={interestTemplate}
              />
              <Column
                field="max_amount"
                header="Max Amount"
                sortable
                body={currencyTemplate}
              />
              <Column
                field="min_amount"
                header="Min Amount"
                sortable
                body={currencyTemplate}
              />
              <Column field="period.name" header="Period Type" sortable />
              <Column field="min_period" header="Min Period" sortable />
              <Column field="max_period" header="Max Period" sortable />
              <Column
                field="is_active"
                header="Status"
                sortable
                body={statusTemplate}
              />
              <Column
                field="created_by.username"
                header="Created By"
                sortable
              />
            </DataTable>
          </div>
        </BlockUI>
      </div>
    </div>
  );
};

export default SettingsPage;
