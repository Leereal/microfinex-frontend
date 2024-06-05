import { Badge } from "primereact/badge";
import { formatCurrency } from "./helpers";
import { Tag } from "primereact/tag";

export const currencyTemplate = (rowData: any, options: any) => {
  // Assuming `options.field` contains the name of the field you want to format as currency
  const value = rowData[options.field] as number;
  // Format the currency using the provided settings
  // Ensure you pass the appropriate settings for formatting
  const formattedCurrency = formatCurrency(
    value /* your settings object here */
  );

  return (
    <div>
      <span className="text-bold">{formattedCurrency}</span>
    </div>
  );
};

export const statusTemplate = (rowData: any) => {
  const isActive = rowData.is_active;
  return (
    <Tag
      value={isActive ? "Active" : "Inactive"}
      severity={isActive ? "success" : "danger"}
    />
  );
};
