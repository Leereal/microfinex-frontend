import { useSession } from "next-auth/react";

export const useUserPermissions = () => {
  const session = useSession();

  // Combine user and group permissions for a comprehensive list
  const userPermissions = session.data?.user?.user_permissions || [];
  const groupPermissions =
    session.data?.user?.groups?.flatMap(
      (group: any) => group.permissions || []
    ) || [];

  // Extract and return only codenames from permissions (removing duplicates)
  const permissionCodenames = [
    ...new Set([
      ...userPermissions.map((permission) => permission.codename),
      ...groupPermissions.map((permission) => permission.codename),
    ]),
  ];

  return permissionCodenames;
};
