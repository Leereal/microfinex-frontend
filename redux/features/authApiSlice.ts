import { apiSlice } from "../services/apiSlice";

interface User {
  first_name: string;
  last_name: string;
  email: string;
}

interface SocialAuthArgs {
  provider: string;
  state: string;
  code: string;
}
//TODO add the actual response we get when we register and if different don't use user
interface CreateUserResponse {
  success: boolean;
  user: User;
}

//This will help not to have all endpoints configured in apiSlice
//So we have authApiSlice that will have all the endpoints related to authentication
const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUser: builder.query<User, void>({
      query: () => "/auth/user/",
    }),
    //Below code is only when we want to use social media authentication
    // socialAuthenticate: builder.mutation<CreateUserResponse, SocialAuthArgs>({
    //   query: ({ provider, state, code }) => ({
    //     url: `/o/${provider}/?state=${encodeURIComponent(
    //       state
    //     )}&code=${encodeURIComponent(code)}`,
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   }),
    // }),
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
  }),
});

export const {
  useRetrieveUserQuery,
  //   useSocialAuthenticateMutation,
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLogoutMutation,
  useVerifyTokenMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
} = authApiSlice;
