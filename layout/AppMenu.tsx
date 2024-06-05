/* eslint-disable @next/next/no-img-element */

import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import Link from "next/link";
import { AppMenuItem } from "@/types";
import { useCheckPermissions } from "@/hooks/use-check-permission";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model: AppMenuItem[] = [
    {
      label: "Home",
      items: [
        {
          label: "Dashboard",
          icon: "pi pi-fw pi-home",
          to: "/dashboard",
          permission: [],
        },
        {
          label: "Disburse Loan",
          icon: "pi pi-fw pi-wallet",
          to: "/loans",
          permission: [],
        },
        {
          label: "Make Payment",
          icon: "pi pi-fw pi-credit-card",
          to: "/",
          permission: [],
        },
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
          permission: ["view_user", "view_users"],
        },
        {
          label: "Add User",
          icon: "pi pi-fw pi-id-card",
          to: "/all-clients",
        },
      ],
      permission: [],
    },
    {
      label: "Branches",
      items: [
        {
          label: "All Branches",
          icon: "pi pi-fw pi-id-card",
          to: "/branches",
          permission: [],
        },
        {
          label: "Branch Assets",
          icon: "pi pi-fw pi-id-card",
          to: "/branch-assets",
          permission: [],
        },
      ],
      permission: [],
    },
    {
      label: "Settings",
      items: [
        {
          label: "General Settings",
          icon: "pi pi-fw pi-id-card",
          to: "/settings",
          permission: [],
        },
        {
          label: "Audit Changes",
          icon: "pi pi-fw pi-id-card",
          to: "/settings/audit-change",
          permission: [],
        },
      ],
      permission: [],
    },
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          // Check if the item has permission specified and if the user has that permission
          const hasPermission =
            !item.permission ||
            useCheckPermissions({ allowedPermissions: item.permission });
          return hasPermission ? (
            !item?.seperator ? (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            ) : (
              <li className="menu-separator"></li>
            )
          ) : null;
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
