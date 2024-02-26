import { auth } from "@/auth";
import { PermissionCheckProps } from "@/types/next-auth";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentGroups = async () => {
  const session = await auth();
  return session?.user?.groups;
};

export const currentPermissions = async () => {
  const session = await auth();

  // Combine user and group permissions for a comprehensive list
  const userPermissions: Permission[] = session?.user?.user_permissions || [];
  const groupPermissions: Permission[] =
    session?.user?.groups?.flatMap((group: Group) => group.permissions || []) ||
    [];

  // Extract and return only codenames from permissions (removing duplicates)
  const permissionCodenames: String[] = [
    ...new Set([
      ...userPermissions.map((permission) => permission.codename),
      ...groupPermissions.map((permission) => permission.codename),
    ]),
  ];

  return permissionCodenames;
};

export const checkPermissions = async ({
  allowedPermissions,
  notAllowedPermissions,
}: PermissionCheckProps) => {
  const userPermissions = await currentPermissions();

  // Check permissions using logical AND for `allowedPermissions` and logical OR for `notAllowedPermissions`
  const hasPermission =
    (!allowedPermissions ||
      !allowedPermissions.length || // If no allowedPermissions specified, it's always true
      allowedPermissions.some((permission) =>
        userPermissions.includes(permission)
      )) &&
    (!notAllowedPermissions ||
      !notAllowedPermissions.length || // If no notAllowedPermissions specified, it's always true
      !notAllowedPermissions.some((permission) =>
        userPermissions.includes(permission)
      ));

  return hasPermission;
};
