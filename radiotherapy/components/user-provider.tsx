"use client";

import { UserContext } from "@/lib/contexts";
import { type User } from "@prisma/client";
import { type ReactNode } from "react";

export function UserProvider({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
