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
      <div className="grid grid-cols-2 gap-2">
        {users?.map((user) => (
          <UserItem user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
};

export default UserList;
