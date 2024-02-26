// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { cookies } from "next/headers";
// import { parse } from "cookie";
// import axios from "axios";

// export const authOptions: NextAuthOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
//   // session: {
//   //   strategy: "jwt",
//   // },
//   pages: {
//     signIn: "/auth/login",
//     error: "/auth/error",
//     verifyRequest: "/auth/verify-request",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {},
//         password: {},
//       },
//       async authorize(credentials, req) {
//         try {
//           const response = await axios.post(
//             process.env.NEXT_PUBLIC_API_URL + "/auth/login/",
//             {
//               email: credentials?.email,
//               password: credentials?.password,
//             }
//           );
//           const apiCookies = response.headers["set-cookie"];
//           if (apiCookies && apiCookies.length > 0) {
//             apiCookies.forEach((cookie) => {
//               const parsedCookie = parse(cookie);
//               const [cookieName, cookieValue] = Object.entries(parsedCookie)[0];
//               const httpOnly = cookie.includes("httponly;");

//               cookies().set({
//                 name: cookieName,
//                 value: cookieValue,
//                 httpOnly: httpOnly,
//                 maxAge: parseInt(parsedCookie["Max-Age"]),
//                 path: parsedCookie.path,
//                 expires: new Date(parsedCookie.expires),
//                 secure: false,
//               });
//             });
//           }
//           return response.data;
//         } catch (e: any) {
//           console.log(e.response.data);
//           throw Error(e.response);
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     // async jwt({ token, user }) {
//     //   console.log("JWT CALLBACK", token);
//     //   return { {access: user.token}, ...user };
//     // },
//     async session({ session, token, user }) {
//       session.user = token.user as any;
//       return session;
//     },
//   },
// };
