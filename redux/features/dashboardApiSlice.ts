import { apiSlice } from "../services/apiSlice";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardSummary, void>({
      query: () => "/dashboard/",
      providesTags: ["Disbursement"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApiSlice;
