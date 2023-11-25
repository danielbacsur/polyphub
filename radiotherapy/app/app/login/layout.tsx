import { type ReactNode } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <div className="grid h-full place-items-center">{children}</div>;
}
