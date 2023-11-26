import { SessionProvider } from "@/components/session-provider";
import { type ReactNode } from "react";
import { type Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Polyp HUB",
  description: "Discover our solutions for the Junction X Budapest hackathon",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
