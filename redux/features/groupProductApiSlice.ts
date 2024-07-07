import { apiSlice } from "../services/apiSlice";
import {
  GroupProductResponseSchema,
  GroupProductRequestSchema,
} from "@/schemas/group-product.schemas";
//Group products are related to clients not user so it's client's group products and fix this both BE and FE
//Update loan disbursement as well
const groupProductApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllGroupProducts: builder.query<
      (typeof GroupProductResponseSchema)[],
      void
    >({
      query: () => "/group-products/all",
      providesTags: ["GroupProduct"],
    }),
    getGroupProducts: builder.query<
      (typeof GroupProductResponseSchema)[],
      void
    >({
      query: () => "/group-products/",
      providesTags: ["GroupProduct"],
    }),
    getGroupProduct: builder.query<typeof GroupProductResponseSchema, number>({
      query: (id: number) => `/group-products/${id}/`,
      providesTags: ["GroupProduct"],
    }),
    createGroupProduct: builder.mutation<
      void,
      typeof GroupProductRequestSchema
    >({
      query: (data: typeof GroupProductRequestSchema) => ({
        url: "/group-products/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["GroupProduct"],
    }),
    updateGroupProduct: builder.mutation({
      query: ({
        id,
        ...data
      }: {
        id: number;
        data: typeof GroupProductRequestSchema;
      }) => ({
        url: `/group-products/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["GroupProduct"],
    }),
    deleteGroupProduct: builder.mutation({
      query: (id: number) => ({
        url: `/group-products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["GroupProduct"],
    }),
  }),
});

export const {
  useGetAllGroupProductsQuery,
  useGetGroupProductsQuery,
  useGetGroupProductQuery,
  useCreateGroupProductMutation,
  useUpdateGroupProductMutation,
  useDeleteGroupProductMutation,
} = groupProductApiSlice;
