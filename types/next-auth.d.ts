import NextAuth from "next-auth";
import { User } from "./user";

declare module "next-auth" {
  interface Session {
    user: UserType;
  }
}

interface PermissionCheckProps {
  allowedPermissions?: String[];
  notAllowedPermissions?: String[];
}
