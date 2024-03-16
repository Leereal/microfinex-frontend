import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import { NextResponse } from "next/server";
import { currentPermissions, currentUser } from "./utils/auth";

const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
  const user: UserType | undefined = await currentUser();
  const userPermissions: String[] = await currentPermissions();

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const canSwitchBranch = !!user?.branches.length;

  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }
  // Check if we are not logged in and the route is not public
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
  //Force switching branch if user doesn't have active_branch
  if (
    canSwitchBranch &&
    !user.active_branch &&
    nextUrl.pathname !== "/switch-branch"
  ) {
    return Response.redirect(new URL("/switch-branch", nextUrl));
  }

  //Disallow switching branches for users with not more than one branch
  if (!canSwitchBranch && nextUrl.pathname === "/switch-branch") {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // LET"S CHECK PERMISSIONS NOW !!!!
  //Let's check permission. User must have one of the permissions required by the pathname to proceed if not redirect to permission denied page

  // Find a matching path with dynamic path handling and permission check
  const matchingPath = paths.find((p) => {
    if (p.path.includes("[id]")) {
      const regex = new RegExp(`^${p.path.replace("[id]", "\\w+")}$`);
      return regex.test(nextUrl.pathname);
    }
    return p.path === nextUrl.pathname;
  });

  // If no matching path found, allow access (assuming no specific permissions required)
  if (!matchingPath) {
    return NextResponse.next();
  }

  // If permissions are required for this path
  if (matchingPath.permission.length > 0) {
    // Check if user has any of the required permissions
    const hasRequiredPermission = userPermissions.some((permission) =>
      matchingPath.permission.includes(permission.toString())
    );

    if (!hasRequiredPermission) {
      // Redirect to permission denied page
      return Response.redirect(new URL("/auth/access", nextUrl));
    }
  }

  //Allow all other routes that passed the checks
  return NextResponse.next();
});

export const config = {
  // #Exaecute auth middleware for all routes except those that end with a file extension or start with _next or /api
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

//List all paths that needs protection here
const paths = [
  {
    path: "/dashboard",
    permission: [],
  },
  {
    path: "/users",
    permission: ["view_user"],
  },
];
