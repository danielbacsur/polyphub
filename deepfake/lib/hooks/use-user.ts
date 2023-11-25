import { UserContext } from "@/lib/contexts";
import { type User } from "@prisma/client";
import { useContext } from "react";

export function useUser(): User {
  const context = useContext(UserContext);

  if (!context) throw new Error("UserContext not defined.");

  return context;
}
