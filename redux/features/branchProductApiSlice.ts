import { apiSlice } from "../services/apiSlice";

const branchProductApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranchProducts: builder.query<BranchProductType[], void>({
      query: () => "/branch-products/",
      providesTags: ["BranchProduct"],
    }),
    getBranchProduct: builder.query<BranchProductType, number>({
      query: (id: number) => `/branch-products/${id}/`,
      providesTags: ["BranchProduct"],
    }),
    createBranchProduct: builder.mutation<void, BranchProductType>({
      query: (data: BranchProductType) => ({
        url: "/branch-products/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BranchProduct"],
    }),
    updateBranchProduct: builder.mutation({
      query: ({ id, ...data }: { id: number; data: BranchProductType }) => ({
        url: `/branch-products/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["BranchProduct"],
    }),
    deleteBranchProduct: builder.mutation({
      query: (id: number) => ({
        url: `/branch-products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["BranchProduct"],
    }),
  }),
});

export const {
  useGetBranchProductsQuery,
  useGetBranchProductQuery,
  useCreateBranchProductMutation,
  useUpdateBranchProductMutation,
  useDeleteBranchProductMutation,
} = branchProductApiSlice;
