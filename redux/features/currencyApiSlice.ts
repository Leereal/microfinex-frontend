import { apiSlice } from "../services/apiSlice";

const currencyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencies: builder.query<CurrencyType[], void>({
      query: () => "/currencies/",
      providesTags: ["Currency"],
    }),
    getCurrency: builder.query<CurrencyType, number>({
      query: (id: number) => `/currencies/${id}/`,
      providesTags: ["Currency"],
    }),
    createCurrency: builder.mutation<void, CurrencyType>({
      query: (data: CurrencyType) => ({
        url: "/currencies/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Currency"],
    }),
    updateCurrency: builder.mutation({
      query: ({ id, ...data }: { id: number; data: CurrencyType }) => ({
        url: `/currencies/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Currency"],
    }),
    deleteCurrency: builder.mutation({
      query: (id: number) => ({
        url: `/currencies/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Currency"],
    }),
  }),
});

export const {
  useGetCurrenciesQuery,
  useGetCurrencyQuery,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
} = currencyApiSlice;
