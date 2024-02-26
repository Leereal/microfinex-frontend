import NextAuth from "next-auth";
import authConfig from "./auth.config";
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // events:{
  //   async linkAccount({user}){
  //     //Update the current user email accounts by verifying it automatically
  //   }
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
