// BranchTable.js
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { branchActiveTemplate } from "@/components/templates/templates";
import { DataTableValueArray } from "primereact/datatable";
import Image from "next/image";

const BranchAssetTable = ({
  branchAssets,
}: {
  branchAssets: DataTableValueArray;
}) => {
  const purchaseDateTemplate = (rowData: any) => {
    return new Date(rowData.purchaseDate).toLocaleDateString();
  };
  const imagesTemplate = (rowData: any) => {
    return (
      <div>
        {rowData.images.map((image: any, index: number) => (
          <Image
            key={index}
            src={image}
            alt={image}
            className="product-image"
            width={50}
            height={50}
          />
        ))}
      </div>
    );
  };
  return (
    <DataTable value={branchAssets} dataKey="id">
      <Column field="item" header="Item" sortable />
      <Column field="description" header="Description" sortable />
      <Column field="brand" header="Brand" sortable />
      <Column field="color" header="Color" sortable />
      <Column field="quantity" header="Quantity" sortable />
      <Column field="user" header="User ID" sortable />
      <Column field="usedBy" header="Used By User ID" sortable />
      <Column
        field="purchaseDate"
        header="Purchase Date"
        sortable
        body={purchaseDateTemplate}
      />
      <Column
        field="images"
        header="Images"
        body={imagesTemplate}
        sortable={false}
      />
    </DataTable>
  );
};

export default BranchAssetTable;
