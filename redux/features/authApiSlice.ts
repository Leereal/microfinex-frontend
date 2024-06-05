import { apiSlice } from "../services/apiSlice";

//This will help not to have all endpoints configured in apiSlice
//So we have authApiSlice that will have all the endpoints related to authentication
const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUser: builder.query<UserType, void>({
      query: () => "/auth/user/",
    }),
    verifyToken: builder.mutation({
      query: () => ({
        url: "/auth/token/verify/",
        method: "POST",
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login/",
        method: "POST",
        body: { email, password },
      }),
    }),
    register: builder.mutation({
      query: ({ first_name, last_name, email, password1, password2 }) => ({
        url: "/auth/registration/",
        method: "POST",
        body: { first_name, last_name, email, password1, password2 },
      }),
    }),
    verify: builder.mutation({
      query: ({ key }) => ({
        url: "/auth/registration/verify-email/",
        method: "POST",
        body: { key },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout/",
        method: "POST",
      }),
    }),
    passwordChange: builder.mutation({
      query: ({ old_password, new_password1, new_password2 }) => ({
        url: "/auth/password/change/",
        method: "POST",
        body: { old_password, new_password1, new_password2 },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/password/reset/",
        method: "POST",
        body: { email },
      }),
    }),
    resetPasswordConfirm: builder.mutation({
      query: ({ uid, token, new_password1, new_password2 }) => ({
        url: "/auth/password/reset/confirm/",
        method: "POST",
        body: { uid, token, new_password1, new_password2 },
      }),
    }),
    switchBranch: builder.mutation({
      query: ({ branch }) => ({
        url: "/auth/user/",
        method: "PATCH",
        body: { active_branch: branch },
      }),
    }),
  }),
});

export const {
  useRetrieveUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLogoutMutation,
  useVerifyTokenMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
  useSwitchBranchMutation,
} = authApiSlice;
