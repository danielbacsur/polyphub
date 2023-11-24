"use client";

import { ValidationContext } from "@/lib/contexts";
import { type Validation } from "@prisma/client";
import { type ReactNode } from "react";

export function UserProvider({
  validation,
  children,
}: {
  validation: Validation;
  children: ReactNode;
}) {
  return (
    <ValidationContext.Provider value={validation}>
      {children}
    </ValidationContext.Provider>
  );
}
