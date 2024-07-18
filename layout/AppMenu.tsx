/* eslint-disable @next/next/no-img-element */

import React from "react";
import AppMenuitem from "./AppMenuitem";
import { MenuProvider } from "./context/menucontext";
import Link from "next/link";
import { AppMenuItem } from "@/types";
import { PermissionCheck } from "@/components/auth/PermissionCheck";

const AppMenu = () => {
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
          permission: ["add_loan", "change_loan", "delete_loan"],
        },
        {
          label: "Make Payment",
          icon: "pi pi-fw pi-credit-card",
          to: "/repayments",
          permission: ["add_loan", "change_loan", "delete_loan"],
        },
      ],
    },
    {
      label: "Clients",
      items: [
        {
          label: "All Clients",
          icon: "pi pi-fw pi-users",
          to: "/clients",
        },
        {
          label: "Add Client",
          icon: "pi pi-fw pi-user-plus",
          to: "/clients",
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
          permission: ["view_branch"],
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
    {
      label: "Reports",
      items: [
        {
          label: "Daily Summary",
          icon: "pi pi-fw pi-chart-line",
          to: "/reports/daily-summary",
          permission: [],
        },
      ],
    },
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          // Check if the item has permission specified and if the user has that permission

          return !item?.seperator ? (
            <PermissionCheck allowedPermissions={item.permission} key={i}>
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            </PermissionCheck>
          ) : (
            <li className="menu-separator" key={i}></li>
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
