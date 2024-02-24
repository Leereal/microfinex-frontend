import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth";
import { NextRequest } from "next/server";

interface RouteHandlerContext {
  params: { nextauth: string[] };
}

const handler = async (req: NextRequest, context: RouteHandlerContext) => {
  return NextAuth(req, context, authOptions);
};

export { handler as GET, handler as POST };
