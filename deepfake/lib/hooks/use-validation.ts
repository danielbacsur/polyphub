import {  ValidationContext } from "@/lib/contexts";
import { type Validation } from "@prisma/client";
import { useContext } from "react";

export function useValidation(): Validation {
  const context = useContext(ValidationContext);

  if (!context) throw new Error("ValidationContext not defined.");

  return context;
}
