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

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

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
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
    },
    {
      label: "Support",
      icon: "pi pi-question",
    },
    {
      label: "Logout",
      icon: "pi pi-power-off",
    },
  ];

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

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

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
          <i className="pi pi-user"></i>
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
