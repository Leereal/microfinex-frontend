import {
  CreateLoanTransactionType,
  LoanTransactionType,
} from "@/schemas/transaction.schema";
import { apiSlice } from "../services/apiSlice";
import { formatDate } from "@/utils/helpers";

const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<LoanTransactionType[], string | void>({
      query: (date) => {
        const queryDate = date || formatDate(new Date());
        return `/loan-transactions/?date=${queryDate}`;
      },
      // Transform data to whatever shape you want.
      transformResponse: (response: LoanTransactionType[]) =>
        response.sort((a, b) => b.id! - a.id!), // non-null assertion
      providesTags: ["Transaction"],
    }),
    getTransaction: builder.query<LoanTransactionType, number>({
      query: (id: number) => `/loan-transactions/${id}/`,
      providesTags: ["Transaction"],
    }),
    createTransaction: builder.mutation<void, CreateLoanTransactionType>({
      query: (data: CreateLoanTransactionType) => ({
        url: "/loan-transactions/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transaction"],
    }),
    updateTransaction: builder.mutation({
      query: ({ id, ...data }: { id: Number }) => ({
        url: `/loan-transactions/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Transaction"],
    }),
    deleteTransaction: builder.mutation({
      query: (id: Number) => ({
        url: `/loan-transactions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApiSlice;
