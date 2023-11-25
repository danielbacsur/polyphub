import { ValidationsContext } from "@/lib/contexts";
import { type EValidation } from "../types/prisma";
import { useContext } from "react";

export function useValidations(): EValidation[] {
  const context = useContext(ValidationsContext);

  if (!context) throw new Error("ValidationContext not defined.");

  return context;
}
