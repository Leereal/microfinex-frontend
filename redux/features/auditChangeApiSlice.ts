import { apiSlice } from "../services/apiSlice";

const auditChangeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuditChanges: builder.query<AuditChangeType[], void>({
      query: () => "/change-audits/",
      providesTags: ["AuditChange"],
    }),
    getAuditChange: builder.query<AuditChangeType, number>({
      query: (id: number) => `/change-audits/${id}/`,
      providesTags: ["AuditChange"],
    }),
  }),
});

export const { useGetAuditChangesQuery, useGetAuditChangeQuery } =
  auditChangeApiSlice;
