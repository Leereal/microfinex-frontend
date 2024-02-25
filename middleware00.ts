import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth;
    console.log("Token", token);

    if (token) {
      const pathname = req.nextUrl.pathname;
      console.log("pathname name", pathname);

      // Find a matching path with dynamic path handling
      const path = paths.find((p) => {
        if (p.path.includes("[id]")) {
          // Replace '[id]' with a regex pattern and test the pathname
          const regex = new RegExp(`^${p.path.replace("[id]", "\\w+")}$`);
          return regex.test(pathname);
        }
        return p.path === pathname;
      });

      console.log("path :", path);

      // if (!path) {
      //   return NextResponse.redirect(new URL("/", req.url));
      // }

      //   const userPermissions = token.permissions || [];

      //   const hasPermission = path.permission.some((p) =>
      //     userPermissions.includes(p)
      //   );

      //   if (!hasPermission) {
      //     return NextResponse.redirect(new URL("/access", req.url));
      //   }

      return NextResponse.next();
    }
  }
);

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth/|access).*)",
  ],
};

const paths = [
  {
    path: "/dashboard",
    permission: [],
  },
  {
    path: "/products",
    permission: ["view_product"],
  },
  {
    path: "/users",
    permission: ["view_user"],
  },
  {
    path: "/clients/[id]",
    permission: ["view_client"],
  },
];
