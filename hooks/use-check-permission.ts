import { useUserPermissions } from "./use-current-permissions";
import { PermissionCheckProps } from "@/types/next-auth";

export const useCheckPermissions = ({
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

  return hasPermission;
};
