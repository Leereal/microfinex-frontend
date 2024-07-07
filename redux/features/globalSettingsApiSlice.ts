import { GlobalSettingsType } from "@/schemas/global-settings.schemas";
import { apiSlice } from "../services/apiSlice";

const globalSettingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalSettings: builder.query<GlobalSettingsType[], void>({
      query: () => "/global-settings/",
      // Assuming the global settings is always one row, no need to sort or transform
      providesTags: ["GlobalSettings"],
    }),
    updateGlobalSettings: builder.mutation<void, GlobalSettingsType>({
      query: (data: GlobalSettingsType) => ({
        url: `/global-settings/${data.id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["GlobalSettings"],
    }),
  }),
});

export const { useGetGlobalSettingsQuery, useUpdateGlobalSettingsMutation } =
  globalSettingsApiSlice;
