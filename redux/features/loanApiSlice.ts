import { LoanType, TransactionType } from "@/types/common";
import { apiSlice } from "../services/apiSlice";
import { DisbursementType } from "@/schemas/disbursement.schema";
import { RepaymentType } from "@/schemas/repayment.schema";

const loanApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLoans: builder.query<LoanType[], void>({
      query: () => "/loans/all/",
      providesTags: ["Disbursement"],
    }),

    getLoans: builder.query<LoanType[], void>({
      query: () => "/loans/",
      transformResponse: (response: LoanType[]) =>
        response.sort((a, b) => b.id! - a.id!), // non-null assertion
      providesTags: ["Disbursement"],
    }),

    getRepayments: builder.query<TransactionType[], void>({
      query: () => "/loans/payments/",
      transformResponse: (response: TransactionType[]) =>
        response.sort((a, b) => b.id! - a.id!), // non-null assertion
      providesTags: ["Repayment"],
    }),

    getLoan: builder.query<LoanType, number>({
      query: (id: number) => `/loans/${id}/`,
      providesTags: ["Disbursement"],
    }),

    disburseLoan: builder.mutation<void, any>({
      query: (data: any) => ({
        url: "/loans/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        console.log("args : ", args);
        const { data: result } = await queryFulfilled;
        console.log("result : ", result);
        dispatch(
          loanApiSlice.util.updateQueryData(
            "getLoans",
            undefined,
            (draft: any) => {
              draft.unshift(result);
            }
          )
        );
      },
    }),

    repayLoan: builder.mutation<void, any>({
      query: (data: RepaymentType) => ({
        url: "/loans/repayment/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const { data: result } = await queryFulfilled;
        dispatch(
          loanApiSlice.util.updateQueryData(
            "getRepayments",
            undefined,
            (draft: any) => {
              draft.unshift(result);
            }
          )
        );
      },
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
  useGetRepaymentsQuery,
  useRepayLoanMutation,
} = loanApiSlice;
