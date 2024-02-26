import React from "react";
import { auth } from "@/auth";

const UsersPage = async () => {
  const session = await auth();
  return (
    <div className="grid">
      <div className="col-12">
        {JSON.stringify(session)}
        <div className="card">
          <h5>Empty Page {JSON.stringify(session)}</h5>
          <p>
            Use this page to start from scratch and place your custom content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
