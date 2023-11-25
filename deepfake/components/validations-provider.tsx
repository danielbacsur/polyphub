"use client";

import { ValidationsContext } from "@/lib/contexts";
import { type EValidation } from "@/lib/types/prisma";
import { type ReactNode } from "react";

export function ValidationsProvider({
  validations,
  children,
}: {
  validations: EValidation[];
  children: ReactNode;
}) {
  return (
    <ValidationsContext.Provider value={validations}>
      {children}
    </ValidationsContext.Provider>
  );
}
