import { FinanceType, CreateFinanceType } from "@/schemas/finance.schemas";
import { apiSlice } from "../services/apiSlice";

const financeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFinances: builder.query<FinanceType[], void>({
      query: () => "/finance/",
      // Transform data to whatever shape you want.
      transformResponse: (response: FinanceType[]) =>
        response.sort((a, b) => b.id! - a.id!), // non-null assertion
      providesTags: ["Finance"],
    }),
    getFinance: builder.query<FinanceType, number>({
      query: (id: number) => `/finances/${id}/`,
      providesTags: ["Finance"],
    }),
    createFinance: builder.mutation<void, CreateFinanceType>({
      query: (data: CreateFinanceType) => ({
        url: "/finance/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Finance"],
    }),
    updateFinance: builder.mutation({
      query: ({ id, ...data }: { id: Number }) => ({
        url: `/finance/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Finance"],
    }),
    deleteFinance: builder.mutation({
      query: (id: Number) => ({
        url: `/finance/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Finance"],
    }),
  }),
});

export const {
  useGetFinancesQuery,
  useGetFinanceQuery,
  useCreateFinanceMutation,
  useUpdateFinanceMutation,
  useDeleteFinanceMutation,
} = financeApiSlice;
