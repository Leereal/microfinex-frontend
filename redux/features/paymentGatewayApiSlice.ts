import { PaymentGatewayType } from "@/types/common";
import { apiSlice } from "../services/apiSlice";

const paymentGatewayApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentGateways: builder.query<PaymentGatewayType[], void>({
      query: () => "/payment-gateways/",
      transformResponse: (response: PaymentGatewayType[]) =>
        response.sort((a, b) => a.name.localeCompare(b.name)),
      providesTags: ["PaymentGateway"],
    }),

    getPaymentGateway: builder.query<PaymentGatewayType, number>({
      query: (id: number) => `/payment-gateways/${id}/`,
      providesTags: ["PaymentGateway"],
    }),

    createPaymentGateway: builder.mutation<void, PaymentGatewayType>({
      query: (data: PaymentGatewayType) => ({
        url: "/payment-gateways/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const { data: result } = await queryFulfilled;
        dispatch(
          paymentGatewayApiSlice.util.updateQueryData(
            "getPaymentGateways",
            undefined,
            (draft:any) => {
              draft.push(result);
            }
          )
        );
      },
      
    }),

    updatePaymentGateway: builder.mutation<void, { id: number; data: PaymentGatewayType }>({
      query: ({ id, data }) => ({
        url: `/payment-gateways/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PaymentGateway"],
    }),

    deletePaymentGateway: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/payment-gateways/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentGateway"],
    }),
  }),
});

export const {
  useGetPaymentGatewaysQuery,
  useGetPaymentGatewayQuery,
  useCreatePaymentGatewayMutation,
  useUpdatePaymentGatewayMutation,
  useDeletePaymentGatewayMutation,
} = paymentGatewayApiSlice;
