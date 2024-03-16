import { apiSlice } from "../services/apiSlice";

//TODO create delete, update and create user
const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/profiles/",
      providesTags: ["User"],
    }),

    getUser: builder.query<ProfileType, number>({
      query: (id: number) => `/users/${id}/`,
      providesTags: ["User"],
    }),

    createUser: builder.mutation<void, ProfileType>({
      query: (data: ProfileType) => ({
        url: "/users/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...data }: { id: Number }) => ({
        url: `users/${id}/update/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id: Number) => ({
        url: `/users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
