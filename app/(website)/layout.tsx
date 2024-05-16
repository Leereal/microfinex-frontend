"use client";
import theme from "@/theme";
import { Theme } from "@emotion/react";
import React from "react";
import { ThemeUIProvider } from "theme-ui";
export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const customTheme: Theme = {
    ...theme,
  };

  return <ThemeUIProvider theme={customTheme}>{children}</ThemeUIProvider>;
}
