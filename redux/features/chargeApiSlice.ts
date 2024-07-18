import { ChargeType, CreateChargeType } from "@/schemas/charge.schema";
import { apiSlice } from "../services/apiSlice";

const chargeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCharges: builder.query<ChargeType[], void>({
      query: () => "/charges/",
      transformResponse: (response: ChargeType[]) =>
        response.sort((a, b) => b.id! - a.id!), // non-null assertion
      providesTags: ["Charge"],
    }),
    getCharge: builder.query<ChargeType, number>({
      query: (id: number) => `/charges/${id}/`,
      providesTags: ["Charge"],
    }),
    createCharge: builder.mutation<void, CreateChargeType>({
      query: (data: CreateChargeType) => ({
        url: "/charges/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Charge"],
    }),
    updateCharge: builder.mutation<void, Partial<ChargeType> & { id: number }>({
      query: ({ id, ...data }) => ({
        url: `/charges/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Charge"],
    }),
    deleteCharge: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/charges/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Charge"],
    }),
  }),
});

export const {
  useGetChargesQuery,
  useGetChargeQuery,
  useCreateChargeMutation,
  useUpdateChargeMutation,
  useDeleteChargeMutation,
} = chargeApiSlice;
