import { BranchSettingsType } from "@/schemas/branch-settings.schemas";
import { apiSlice } from "../services/apiSlice";

const branchSettingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBranchSettings: builder.query<BranchSettingsType[], void>({
      query: () => "/branch-settings/",
      //Transform data to whatever shape you want.
      transformResponse: (response: BranchSettingsType[]) =>
        response.sort((a, b) => b.id! - a.id!), // non-null assertion
      providesTags: ["BranchSettings"],
    }),
    getBranchSettings: builder.query<BranchSettingsType, number>({
      query: (id: number) => `/branch-settings/${id}/`,
      providesTags: ["Branch"],
    }),
    createBranchSettings: builder.mutation<void, BranchSettingsType>({
      query: (data: BranchSettingsType) => ({
        url: `/branch-settings/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BranchSettings"],
    }),
    updateBranchSettings: builder.mutation<void, BranchSettingsType>({
      query: (data: BranchSettingsType) => ({
        url: `/branch-settings/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["BranchSettings"],
    }),
    deleteBranchSettings: builder.mutation<void, number>({
      query: (id: number) => `/branches/${id}/settings/`,
      invalidatesTags: ["BranchSettings"],
    }),
  }),
});

export const {
  useGetAllBranchSettingsQuery,
  useGetBranchSettingsQuery,
  useCreateBranchSettingsMutation,
  useUpdateBranchSettingsMutation,
  useDeleteBranchSettingsMutation,
} = branchSettingsApiSlice;

export default branchSettingsApiSlice;
