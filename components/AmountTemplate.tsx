import React from "react";
import { useGetCurrenciesQuery } from "@/redux/features/currencyApiSlice";
import { formatCurrency } from "@/utils/helpers";
import { CurrencyType } from "@/schemas/currency.schema";

interface AmountTemplateProps {
  amount: number;
  currencyId: number | string;
}

const AmountTemplate: React.FC<AmountTemplateProps> = ({
  amount,
  currencyId,
}) => {
  const { data: currencies } = useGetCurrenciesQuery();
  const currency =
    currencies?.find(
      (curr: CurrencyType) => curr.id === currencyId || curr.code === currencyId
    ) || null;

  return <span>{formatCurrency(amount, currency)}</span>;
};

export default AmountTemplate;
