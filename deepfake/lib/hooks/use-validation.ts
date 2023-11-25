import { ValidationContext, type ValidationContextType } from "@/lib/contexts";
import { useContext } from "react";

export function useValidation(): ValidationContextType {
  const context = useContext(ValidationContext);

  if (!context) throw new Error("ValidationContext not defined.");

  return context;
}
