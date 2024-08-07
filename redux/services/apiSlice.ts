import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setAuth, logout } from "../features/authSlice";
import { Mutex } from "async-mutex";
import { signOut } from "next-auth/react";

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  // TODO make sure this connects to the right API when using NGINX or other reverse proxy
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  credentials: "include", //This will attach cookies automatically to the requests
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/token/refresh/",
            method: "POST",
          },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          //If login successful, set the auth state to true here
          api.dispatch(setAuth());

          result = await baseQuery(args, api, extraOptions);
        } else {
          //if not successful, logout and redirect to login page
          api.dispatch(logout());
          signOut();
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Branch",
    "User",
    "Currency",
    "Product",
    "BranchProduct",
    "AuditChange",
    "BranchAsset",
    "Disbursement",
    "Repayment",
    "Client",
    "GlobalSettings",
    "BranchSettings",
    "GroupProduct",
    "PaymentGateway",
    "Transaction",
    "Finance",
    "Report",
    "Charge",
    "LoanStatus",
  ],
  endpoints: (builder) => ({}),
});
