/* eslint-disable @next/next/no-img-element */

import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import Link from "next/link";
import { AppMenuItem } from "@/types";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model: AppMenuItem[] = [
    {
      label: "Home",
      items: [
        { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" },
        { label: "Disburse Loan", icon: "pi pi-fw pi-wallet", to: "/" },
        { label: "Make Payment", icon: "pi pi-fw pi-credit-card", to: "/" },
      ],
    },
    {
      label: "Clients",
      items: [
        {
          label: "All Clients",
          icon: "pi pi-fw pi-users",
          to: "/all-clients",
        },
        {
          label: "Add Client",
          icon: "pi pi-fw pi-user-plus",
          to: "/all-clients",
        },
      ],
    },
    {
      label: "Users",
      items: [
        {
          label: "All Users",
          icon: "pi pi-fw pi-id-card",
          to: "/users",
        },
        {
          label: "Add User",
          icon: "pi pi-fw pi-id-card",
          to: "/all-clients",
        },
      ],
    },
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item?.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}

        <Link
          href="https://blocks.primereact.org"
          target="_blank"
          style={{ cursor: "pointer" }}
        >
          <img alt="Prime Blocks" className="w-full mt-3" src="/help.png" />
        </Link>
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
