import { UserProvider } from "@/components/user-provider";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { getUser } from "@/lib/fetchers";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  return <UserProvider user={user}>{children}</UserProvider>;
}
