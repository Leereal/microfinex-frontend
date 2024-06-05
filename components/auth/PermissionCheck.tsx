"use client";

import { useUserPermissions } from "@/hooks/use-current-permissions";

interface PermissionCheckProps {
  children: React.ReactNode;
  allowedPermissions?: String[]; // Optional string array of allowed permissions
  notAllowedPermissions?: String[]; // Optional string array of not-allowed permissions
}
export const PermissionCheck = ({
  children,
  allowedPermissions,
  notAllowedPermissions,
}: PermissionCheckProps) => {
  const userPermissions = useUserPermissions();

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

  if (hasPermission) {
    return children; // Display component content if permission granted
  }
  return null; // Or return null to render nothing if permission not granted
};
