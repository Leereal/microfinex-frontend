import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas/auth.schema";
import axios from "axios";
import { parse } from "cookie";
import { cookies } from "next/headers";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          try {
            const { email, password } = validatedFields.data;
            console.log(
              "process.env.NEXT_PUBLIC_API_URL : ",
              process.env.NEXT_PUBLIC_API_URL
            );
            console.log("process.env.AUTH_SECRET : ", process.env.AUTH_SECRET);
            console.log(
              "process.env.NEXTAUTH_SECRET : ",
              process.env.NEXTAUTH_SECRET
            );
            console.log(
              "process.env.NEXTAUTH_URL : ",
              process.env.NEXTAUTH_URL
            );
            const response = await axios.post(
              process.env.NEXT_PUBLIC_API_URL + "/auth/login/",
              {
                email,
                password,
              }
            );

            const apiCookies = response.headers["set-cookie"];
            if (apiCookies && apiCookies.length > 0) {
              apiCookies.forEach((cookie) => {
                const parsedCookie = parse(cookie);
                const [cookieName, cookieValue] = Object.entries(parsedCookie)[0];
                const httpOnly = /httponly/i.test(cookie);
                const secure = /secure/i.test(cookie);
                
                console.log(`Cookie: ${cookieName} = ${cookieValue}`);
                
                // Setting the cookie
                cookies().set({
                  name: cookieName,
                  value: cookieValue,
                  httpOnly,
                  secure,
                  maxAge: parseInt(parsedCookie["Max-Age"], 10) || undefined,
                  expires: parsedCookie.expires ? new Date(parsedCookie.expires) : undefined,
                  path: parsedCookie.Path || '/', // Ensure the path is set
                  domain: parsedCookie.Domain || undefined, // Ensure the domain is set
                });
              });
            }
            console.log("Data : ", response.data.user);
            return response.data.user;
          } catch (e: any) {
            console.log(e.response.data);
            throw Error(e.response);
          }
        }
      },
    }),
  ],
  trustHost: true,
} satisfies NextAuthConfig;
