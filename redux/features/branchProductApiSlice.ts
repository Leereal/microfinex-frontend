import {
  BranchProductResponseSchema,
  BranchProductRequestSchema,
} from "@/schemas/branch-product.schemas";
import { apiSlice } from "../services/apiSlice";

const branchProductApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBranchProducts: builder.query<
      (typeof BranchProductResponseSchema)[],
      void
    >({
      query: () => "/branch-products/all",
      providesTags: ["BranchProduct"],
    }),
    getBranchProducts: builder.query<
      (typeof BranchProductResponseSchema)[],
      void
    >({
      query: () => "/branch-products/",
      providesTags: ["BranchProduct"],
    }),
    getBranchProduct: builder.query<typeof BranchProductResponseSchema, number>(
      {
        query: (id: number) => `/branch-products/${id}/`,
        providesTags: ["BranchProduct"],
      }
    ),
    createBranchProduct: builder.mutation<
      void,
      typeof BranchProductRequestSchema
    >({
      query: (data: typeof BranchProductRequestSchema) => ({
        url: "/branch-products/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BranchProduct"],
    }),
    updateBranchProduct: builder.mutation({
      query: ({
        id,
        ...data
      }: {
        id: number;
        data: typeof BranchProductRequestSchema;
      }) => ({
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
