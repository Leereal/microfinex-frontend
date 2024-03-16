import { apiSlice } from "../services/apiSlice";

const branchAssetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranchAssets: builder.query<BranchAssetType[], void>({
      query: () => "/branch-assets/",
      providesTags: ["BranchAsset"],
    }),
    getBranchAsset: builder.query<BranchAssetType, number>({
      query: (id: number) => `/branch-assets/${id}/`,
      providesTags: ["BranchAsset"],
    }),
    createBranchAsset: builder.mutation<void, BranchAssetType>({
      query: (data: BranchAssetType) => ({
        url: "/branch-assets/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BranchAsset"],
    }),
    updateBranchAsset: builder.mutation({
      query: ({ id, ...data }: { id: number } & Partial<BranchAssetType>) => ({
        url: `/branch-assets/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["BranchAsset"],
    }),
    deleteBranchAsset: builder.mutation({
      query: (id: number) => ({
        url: `/branch-assets/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["BranchAsset"],
    }),
  }),
});

export const {
  useGetBranchAssetsQuery,
  useGetBranchAssetQuery,
  useCreateBranchAssetMutation,
  useUpdateBranchAssetMutation,
  useDeleteBranchAssetMutation,
} = branchAssetApiSlice;
