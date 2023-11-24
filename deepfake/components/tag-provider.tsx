"use client";

import { TagContext } from "@/lib/contexts";
import { type Tag } from "@prisma/client";
import { type ReactNode } from "react";

export function UserProvider({
  tag,
  children,
}: {
  tag: Tag;
  children: ReactNode;
}) {
  return <TagContext.Provider value={tag}>{children}</TagContext.Provider>;
}
