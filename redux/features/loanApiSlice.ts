import { apiSlice } from "../services/apiSlice";

const loanApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLoans: builder.query<LoanType[], void>({
      query: () => "/loans/all/",
      providesTags: ["Disbursement"],
    }),

    getLoans: builder.query<LoanType[], void>({
      query: () => "/loans/",
      providesTags: ["Disbursement"],
    }),

    getLoan: builder.query<LoanType, number>({
      query: (id: number) => `/loans/${id}/`,
      providesTags: ["Disbursement"],
    }),

    disburseLoan: builder.mutation<void, DisbursementType>({
      query: (data: DisbursementType) => ({
        url: "/loans/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Disbursement"],
    }),

    updateLoan: builder.mutation({
      query: ({ id, ...data }: { id: number; data: DisbursementType }) => ({
        url: `/loans/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Disbursement"],
    }),

    deleteLoan: builder.mutation({
      query: (id: number) => ({
        url: `/loans/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Disbursement"],
    }),
  }),
});

export const {
  useGetLoansQuery,
  useGetLoanQuery,
  useDisburseLoanMutation,
  useUpdateLoanMutation,
  useDeleteLoanMutation,
} = loanApiSlice;
