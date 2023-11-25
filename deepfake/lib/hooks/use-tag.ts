import { TagContext } from "@/lib/contexts";
import { type Tag } from "@prisma/client";
import { useContext } from "react";

export function useTag(): Tag {
  const context = useContext(TagContext);

  if (!context) throw new Error("TagContext not defined.");

  return context;
}
