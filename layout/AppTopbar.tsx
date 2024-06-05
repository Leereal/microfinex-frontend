/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { AppTopbarRef } from "@/types";
import { LayoutContext } from "./context/layoutcontext";
import { TieredMenu } from "primereact/tieredmenu";
import { MenuItem } from "primereact/menuitem";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/authApiSlice";
import { logout as setLogout } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Avatar } from "primereact/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const user = useCurrentUser();

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const menu = useRef<TieredMenu>(null);
  const items: MenuItem[] = [
    {
      label: "Profile",
      icon: "pi pi-search",
      command: () => handleMenuItemClick("Profile"),
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: () => handleMenuItemClick("Settings"),
    },
    {
      label: "Switch Branch",
      icon: "pi pi-question",
      command: () => handleMenuItemClick("Switch-Branch"),
    },
    {
      label: "Logout",
      icon: "pi pi-power-off",
      command: () => handleMenuItemClick("Logout"),
    },
  ];

  const handleMenuItemClick = (menuItemLabel: string) => {
    switch (menuItemLabel) {
      case "Logout":
        handleLogout();
        break;
      case "Switch-Branch":
        router.push("/switch-branch");
        break;
      default:
        break;
    }
  };
  const handleLogout = async () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
      })
      .catch((error: any) => {})
      .finally(() => {
        signOut();
        // router.push("/auth/login");
      });
  };
  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo flex">
        <img
          //   src={`/logo-${
          //     layoutConfig.colorScheme !== "light" ? "white" : "dark"
          //   }.png`}
          src="/favicon.png"
          width="35"
          height="60"
          alt="logo"
        />
        <span>MICROFINEX</span>
      </Link>

      <div className="flex items-center">
        <button
          ref={menubuttonRef}
          type="button"
          className="p-link layout-menu-button layout-topbar-button"
          onClick={onMenuToggle}
        >
          <i className="pi pi-bars" />
        </button>
        <span className="flex gap-3 ml-3 mt-2 ">
          <span>
            <span className="text-green-600 font-bold">Logged In As </span>:{" "}
            {user?.full_name}
          </span>
          <span>
            <span className="text-green-600 font-bold">Branch </span> :{" "}
            {
              user?.branches.find((x: Branch) => x.id === user.active_branch)
                ?.name
            }
          </span>
        </span>
      </div>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-calendar"></i>
          <span>Calendar</span>
        </button>
        <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
        <button
          type="button"
          className="p-link layout-topbar-button"
          onClick={(e) => menu?.current?.toggle(e)}
        >
          {user?.profile_photo ? (
            <Avatar
              image={`http://localhost:8080/${user?.profile_photo}`}
              shape="circle"
            />
          ) : (
            <i className="pi pi-user"></i>
          )}
          <span>Profile</span>
        </button>
        <Link href="/documentation">
          <button type="button" className="p-link layout-topbar-button">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </button>
        </Link>
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
