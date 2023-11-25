"use client";

import { ValidationContext } from "@/lib/contexts";
import { type EValidation } from "@/lib/types/prisma";
import { type ReactNode } from "react";

export function ValidationProvider({
  validation,
  children,
}: {
  validation: EValidation;
  children: ReactNode;
}) {
  return (
    <ValidationContext.Provider value={validation}>
      {children}
    </ValidationContext.Provider>
  );
}
