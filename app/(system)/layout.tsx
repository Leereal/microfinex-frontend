import { PrimeReactProvider } from "primereact/api";
import Provider from "@/redux/provider";
import { LayoutProvider } from "@/layout/context/layoutcontext";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
export default async function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <React.Fragment>
      <SessionProvider session={session}>
        <Provider>
          <PrimeReactProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </PrimeReactProvider>
        </Provider>
      </SessionProvider>
    </React.Fragment>
  );
}
