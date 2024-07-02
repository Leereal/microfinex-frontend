// export const formatCurrency = (
//   amount: number,
//   settings?: {
//     decimals?: number;
//     symbolPosition?: "before" | "after";
//     currencySymbol?: string;
//   }
// ): string => {
//   // Ensure settings is defined, else default to empty object
//   const safeSettings = settings || {};

//   // Format the amount with the specified number of decimal places
//   let formattedAmount = amount.toFixed(safeSettings.decimals ?? 2);

//   // Determine the position of the currency symbol
//   if (safeSettings.currencySymbol) {
//     if (safeSettings.symbolPosition === "before") {
//       return `${safeSettings.currencySymbol}${formattedAmount}`;
//     } else {
//       return `${formattedAmount}${safeSettings.currencySymbol}`;
//     }
//   } else {
//     // Default formatting using $ symbol
//     return `$${formattedAmount}`;
//   }
// };

export const formatDate = (value: string | Date | null) => {
  if (!value) {
    return null;
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (isNaN(date.getTime())) {
    console.error("Invalid date:", value);
    return null;
  }

  return date.toLocaleDateString("en-ZW", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatCurrency = (value: number) => {
  return value;
  // return value.toLocaleString("en-US", {
  //   style: "currency",
  //   currency: "USD",
  // });
};
