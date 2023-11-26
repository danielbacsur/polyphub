import { ValidationProvider } from "@/components/validation-provider";
import { getValidations } from "@/lib/fetchers/validation";
import { getUser } from "@/lib/fetchers";
import { type ReactNode } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Polyp HUB",
  description: "Discover our solutions for the Junction X Budapest hackathon",
};

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getUser();

  const validations = await getValidations(user.id);

  return (
    <ValidationProvider validations={validations}>
      {children}
    </ValidationProvider>
  );
}
