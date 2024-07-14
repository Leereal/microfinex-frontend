// BranchList.js
import React from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import UserItem from "./UserItem";

const UserList = ({
  users,
  onCreate,
}: {
  users?: ProfileType[];
  onCreate: any;
}) => {
  const toolbarLeftTemplate = () => (
    <Button
      label="New User"
      icon="pi pi-plus"
      style={{ marginRight: ".5em" }}
      onClick={onCreate}
    />
  );
  return (
    <div className="card">
      <h3 className="font-bold text-primary-700">Users List</h3>
      <Toolbar start={toolbarLeftTemplate} />
      <div className="space-y-2 mt-2">
        {users?.map((user) => (
          <div className="w-full" key={user.id}>
            <UserItem user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
