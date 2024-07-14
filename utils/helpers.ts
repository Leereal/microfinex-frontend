import { CurrencyType } from "@/schemas/currency.schema";

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
export const formatCurrency = (
  value: number,
  currency?: CurrencyType | null
): string => {
  if (!currency || !currency.symbol || !currency.code) {
    // Default to USD formatting if currency information is missing
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  const { symbol, code, position = "before" } = currency;

  // Check if the value is negative
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);

  // Format the absolute value without the currency style
  const formattedValue = absoluteValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Determine the position of the currency symbol
  const currencyString = position === "before"
    ? `${symbol ?? "$"}${formattedValue}`
    : `${formattedValue}${symbol ?? "$"}`;

  // Prepend the minus sign if the value is negative
  return isNegative ? `-${currencyString}` : currencyString;
};


export const formatDateTime = (value: string | Date | null): string | null => {
  if (!value) {
    return null;
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (isNaN(date.getTime())) {
    console.error("Invalid date:", value);
    return null;
  }

  return date.toLocaleString("en-ZW", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
