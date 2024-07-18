import {
  CreateLoanStatusType,
  LoanStatusType,
} from "@/schemas/loanStatus.schema";
import { apiSlice } from "../services/apiSlice";

const loanStatusApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoanStatuses: builder.query<LoanStatusType[], void>({
      query: () => "/loan-status/",
      transformResponse: (response: LoanStatusType[]) =>
        response.sort((a, b) => b.id - a.id), // Sort by ID descending
      providesTags: ["LoanStatus"],
    }),
    getLoanStatus: builder.query<LoanStatusType, number>({
      query: (id: number) => `/loan-status/${id}/`,
      providesTags: ["LoanStatus"],
    }),
    createLoanStatus: builder.mutation<void, CreateLoanStatusType>({
      query: (data: CreateLoanStatusType) => ({
        url: "/loan-status/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LoanStatus"],
    }),
    updateLoanStatus: builder.mutation<void, Partial<LoanStatusType>>({
      query: ({ id, ...data }: Partial<LoanStatusType> & { id: number }) => ({
        url: `/loan-status/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["LoanStatus"],
    }),
    deleteLoanStatus: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/loan-status/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["LoanStatus"],
    }),
  }),
});

export const {
  useGetLoanStatusesQuery,
  useGetLoanStatusQuery,
  useCreateLoanStatusMutation,
  useUpdateLoanStatusMutation,
  useDeleteLoanStatusMutation,
} = loanStatusApiSlice;
