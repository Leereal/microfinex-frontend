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
                const httpOnly = cookie.includes("httponly;");

                cookies().set({
                  name: cookieName,
                  value: cookieValue,
                  httpOnly: httpOnly,
                  maxAge: parseInt(parsedCookie["Max-Age"]),
                  path: parsedCookie.path,
                  expires: new Date(parsedCookie.expires),
                  secure: false,
                });
              });
            }
            return response.data.user;
          } catch (e: any) {
            console.log(e.response.data);
            throw Error(e.response);
          }
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
