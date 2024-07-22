import { apiSlice } from "../services/apiSlice";

const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDailySummary: builder.query<any, { date: string }>({
      query: ({ date }) => `/reports/daily-summary/?date=${date}`,
      transformResponse: (response: any) => response,
      providesTags: ["Report"],
    }),

    getMonthlySummary: builder.query<any, { month: string }>({
      query: ({ month }) => `/reports/monthly-summary/?month=${month}`,
      transformResponse: (response: any) => response,
      providesTags: ["Report"],
    }),

    getYearlySummary: builder.query<any, { year: string }>({
      query: ({ year }) => `/reports/yearly-summary/?year=${year}`,
      transformResponse: (response: any) => response,
      providesTags: ["Report"],
    }),

    getMonthlyBranchReport: builder.query<any, { month: string }>({
      query: ({ month }) => `/reports/monthly-branch-report/?month=${month}`,
      transformResponse: (response: any) => response,
      providesTags: ["Report"],
    }),
  }),
});

export const {
  useGetDailySummaryQuery,
  useGetMonthlySummaryQuery,
  useGetYearlySummaryQuery,
  useGetMonthlyBranchReportQuery,
} = reportsApiSlice;
