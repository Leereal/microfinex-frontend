import Layout from "@/layout/layout";
import { Metadata } from "next";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Microfinex Pro",
  description:
    "Manage microfinance loans and streamline financial operations with ease using Microfinex Pro. Our comprehensive solution empowers organizations to efficiently handle loans, track payments, and drive financial growth.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function AppLayout({ children }: AppLayoutProps) {
  return <Layout>{children}</Layout>;
}
