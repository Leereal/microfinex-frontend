import Image from "next/image";
import Link from "next/link";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import React from "react";

const UserItem = ({ user }: { user: ProfileType }) => {
  return (
    <div className="card p-0 w-1/2 ">
      <div className="flex flex-col md:flex-row items-center p-3 justify-between">
        <div className="flex gap-4 items-center mb-3 md:mb-0 justify-between">
          <div className="">
            <Image
              alt="profile pic"
              className="rounded-full"
              width={40}
              height={40}
              src={`http://localhost:8080/${user?.profile_photo}`}
            />
          </div>
          <div className="lg:ml-2 lg:mr-auto text-center lg:text-left lg:mt-0">
            <Link href="" className="font-medium text-nowrap">
              {user?.full_name}
            </Link>
            <div className="text-slate-500 text-xs mt-0.5 text-nowrap">
              Software Engineer
            </div>
          </div>
          <div>
            <InputSwitch checked={true} />
          </div>
        </div>
        <div>
          <p>
            {user.branches.map((branch: any, index) => (
              <React.Fragment key={index}>{branch}</React.Fragment>
            ))}
          </p>
        </div>
        <div className="flex mt-4 lg:mt-0 gap-3">
          <Button className="py-1 px-2 rounded-xl">Message</Button>
          <Button className="bg-transparent text-primary py-1 px-2 rounded-xl">
            Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
