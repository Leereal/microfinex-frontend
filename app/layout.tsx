import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import type { Viewport } from "next";

import "./globals.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "../styles/layout/layout.scss";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Microfinex pro",
  description: "Loan management system for microfinance institutions",
};
export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>{children}</body>
    </html>
  );
}
