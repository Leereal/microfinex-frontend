"use client";
import React, { useRef } from "react";
import { Toast } from "primereact/toast";
import UserList from "./_components/UserList";
import { useGetUsersQuery } from "@/redux/features/userApiSlice";

const UsersPage = () => {
  const toast = useRef<Toast | null>(null);
  const { data, isError, isLoading } = useGetUsersQuery({});

  return (
    <div className="grid">
      <div className="col-12">
        {data && data.results && (
          <UserList users={data.results} onCreate={() => {}} />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
