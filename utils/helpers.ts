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

  // Determine the position of the currency symbol
  const formattedValue = value.toLocaleString("en-US", {
    style: "currency",
    currency: code ?? "USD",
  });

  if (position === "before") {
    return `${symbol ?? "$"}${formattedValue}`;
  } else {
    return `${formattedValue}${symbol ?? "$"}`;
  }
};
