// We must add product API endpoints here etc like what we did with authApiSlice

import { apiSlice } from "../services/apiSlice";

const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductType[], void>({
      query: () => "/products/",
      providesTags: ["Product"],
    }),
    getProduct: builder.query<ProductType, number>({
      query: (id: number) => `/products/${id}/`,
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<void, ProductType>({
      query: (data: ProductType) => ({
        url: "/products/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }: { id: number; data: ProductType }) => ({
        url: `/products/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id: number) => ({
        url: `/products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
