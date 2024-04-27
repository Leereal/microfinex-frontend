import { apiSlice } from "../services/apiSlice";

const clientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllClients: builder.query<ClientType[], void>({
      query: () => "/clients/all/",
      providesTags: ["Client"],
    }),

    getClients: builder.query<ClientType[], void>({
      query: () => "/clients/",
      providesTags: ["Client"],
    }),

    getClient: builder.query<ClientType, number>({
      query: (id: number) => `/clients/${id}/`,
      providesTags: ["Client"],
    }),

    createClient: builder.mutation<void, ClientType>({
      query: (data: ClientType) => ({
        url: "/clients/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Client"],
    }),

    updateClient: builder.mutation<void, { id: number; data: ClientType }>({
      query: ({ id, ...data }: { id: number; data: ClientType }) => ({
        url: `/clients/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Client"],
    }),

    deleteClient: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `/clients/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Client"],
    }),
  }),
});

export const {
  useGetAllClientsQuery,
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApiSlice;
