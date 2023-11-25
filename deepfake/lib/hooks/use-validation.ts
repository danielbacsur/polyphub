import { ValidationContext } from "@/lib/contexts";
import { type EValidation } from "../types/prisma";
import { useContext } from "react";

export function useValidation(): EValidation {
  const context = useContext(ValidationContext);

  if (!context) throw new Error("ValidationContext not defined.");

  return context;
}
