"use client";

import { ValidationContext } from "@/lib/contexts";
import { Validation } from "@/lib/types/prisma";
import { useState, type ReactNode } from "react";

export function ValidationProvider({
  validations,
  children,
}: {
  validations: Validation[];
  children: ReactNode;
}) {
  const [validation, setValidation] = useState<Validation>(validations[0]);

  return (
    <ValidationContext.Provider
      value={{ validations, validation, setValidation }}
    >
      {children}
    </ValidationContext.Provider>
  );
}
