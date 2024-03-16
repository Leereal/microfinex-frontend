"use client";
import { useParams } from "next/navigation";
import { useGetBranchAssetQuery } from "@/redux/features/branchAssetApiSlice";

const BranchAssetPage = () => {
  const params = useParams<{ id: string }>();

  const { data: branchAsset } = useGetBranchAssetQuery(Number(params.id));
  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h3 className="font-bold text-primary-700">Branch List</h3>
          <div className="flex justify-center">
            <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {branchAsset?.item} Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Details and informations about asset
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Asset</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {branchAsset?.item}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Branch
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {branchAsset?.branch}
                    </dd>
                  </div>
                  {/* <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Email Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {branchAsset?.email}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {branchAsset?.address}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {branchAsset?.is_active ? "Active" : "Closed"}
                    </dd>
                  </div> */}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BranchAssetPage;
