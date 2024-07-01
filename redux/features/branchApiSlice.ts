import { BranchType } from "@/schemas/branch.schemas";
import { apiSlice } from "../services/apiSlice";

const branchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<BranchType[], void>({
      query: () => "/branches/",
      //Transform data to whatever shape you want.
      transformResponse: (response: BranchType[]) =>
        response.sort((a, b) => b.id! - a.id!), // non-null assertion
      providesTags: ["Branch"],
    }),
    getBranch: builder.query<BranchType, number>({
      query: (id: number) => `/branches/${id}/`,
      providesTags: ["Branch"],
    }),
    createBranch: builder.mutation<void, BranchType>({
      query: (data: BranchType) => ({
        url: "/branches/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Branch"],
    }),
    updateBranch: builder.mutation({
      query: ({ id, ...data }: { id: Number }) => ({
        url: `/branches/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Branch"],
    }),
    deleteBranch: builder.mutation({
      query: (id: Number) => ({
        url: `/branches/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Branch"],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useGetBranchQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApiSlice;
