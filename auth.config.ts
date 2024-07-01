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
                const [cookieName, cookieValue] =
                  Object.entries(parsedCookie)[0];
                const httpOnly = /httponly/i.test(cookie);
                const secure = /secure/i.test(cookie);

                // Setting the cookie
                cookies().set({
                  name: cookieName,
                  value: cookieValue,
                  httpOnly,
                  secure: true,
                  sameSite: "none",
                  maxAge: parseInt(parsedCookie["Max-Age"], 10) || undefined,
                  expires: parsedCookie.expires
                    ? new Date(parsedCookie.expires)
                    : undefined,
                  path: parsedCookie.Path || "/", // Ensure the path is set
                  domain: parsedCookie.Domain || undefined, // Ensure the domain is set
                });
              });
            }
            return response.data.user;
          } catch (e: any) {
            throw Error(e.response);
          }
        }
      },
    }),
  ],
  trustHost: true,
} satisfies NextAuthConfig;
